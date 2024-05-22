import { Injectable, Logger } from '@nestjs/common';
import { simpleParser } from 'mailparser';
import * as Imap from 'imap';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailDocument } from './email-document.schema';
import { EmailRepository } from './email.repository';
import { parseStringPromise } from 'xml2js';
import DocumentInfo from './email.interface';
import { EmailDto } from './email.dto';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    @InjectModel(EmailDocument.name) private emailModel: Model<EmailDocument>,
    private readonly emailRepository: EmailRepository,
  ) {}

  async getDocuments({
    email,
    password,
    host,
    port,
  }: EmailDto): Promise<EmailDocument[]> {
    return new Promise((resolve, reject) => {
      const imap = new Imap({ user: email, password, host, port, tls: true });

      imap.once('ready', () => {
        imap.openBox('INBOX', true, (err) => {
          if (err) {
            this.logger.error(`Error opening INBOX: ${err}`);
            return reject(err);
          }

          imap.search(['UNSEEN'], async (err, results) => {
            if (err) {
              this.logger.error(`Error searching UNSEEN emails: ${err}`);
              return reject(err);
            }

            if (results.length === 0) {
              imap.end();
              return resolve([]);
            }

            const documents: EmailDocument[] = [];
            const fetch = imap.fetch(results, { bodies: '', struct: true });
            fetch.on('message', (msg) => {
              msg.on('body', (stream) => {
                simpleParser(stream, async (err, parsed) => {
                  if (err) {
                    this.logger.error(`Error parsing email body: ${err}`);
                    return reject(err);
                  }

                  if (parsed.attachments.length > 0) {
                    for (const attachment of parsed.attachments) {
                      const fileExtension = attachment.filename
                        .split('.')
                        .pop()
                        .toLowerCase();
                      if (fileExtension === 'xml') {
                        const fileContent =
                          attachment.content.toString('utf-8');
                        const filename = attachment.filename;

                        const trimmedContent = fileContent.trim();
                        const document = new this.emailModel({
                          date: new Date(),
                          filename: filename,
                          contentFile: trimmedContent,
                        });
                        try {
                          documents.push(document);

                          await document.save();
                        } catch (error) {
                          this.logger.error('Error:', error);
                          reject(error);
                        }
                      }
                    }
                  }
                });
              });

              msg.once('end', () => {
                this.logger.debug('Message finished processing.');
              });
            });

            fetch.once('end', async () => {
              imap.end();
              resolve(documents);
            });
          });
        });
      });

      imap.once('error', (err) => {
        this.logger.error(`IMAP connection error: ${err}`);
        reject(err);
      });

      imap.connect();
    });
  }

  async getDocumentInfo(filename: string): Promise<DocumentInfo> {
    const document = await this.emailRepository.findByFilename(filename);
    if (document) {
      const xmlContent = document.contentFile;
      const result = await parseStringPromise(xmlContent);
      return {
        numeroNota: result.nfeProc.NFe[0].infNFe[0].ide[0].cNF[0],
        cnpjEmitente: result.nfeProc.NFe[0].infNFe[0].emit[0].CNPJ[0],
        nomeEmitente: result.nfeProc.NFe[0].infNFe[0].emit[0].xNome[0],
        cnpjDestinatario: result.nfeProc.NFe[0].infNFe[0].dest[0].CNPJ[0],
        nomeDestinatario: result.nfeProc.NFe[0].infNFe[0].dest[0].xNome[0],
        descricaoProdutos: result.nfeProc.NFe[0].infNFe[0].det.prod[0].xProd[0],
        pesoProduto: result.nfeProc.NFe[0].infNFe[0].det.map(
          (det) => det.prod[0].qCom[0],
        ),
      };
    }
    return null;
  }
}
