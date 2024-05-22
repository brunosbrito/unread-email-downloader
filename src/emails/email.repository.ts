import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailDocument } from './email-document.schema';

@Injectable()
export class EmailRepository {
  constructor(
    @InjectModel(EmailDocument.name)
    private emailDocumentModel: Model<EmailDocument>,
  ) {}

  async save(document: EmailDocument): Promise<EmailDocument> {
    const createdDocument = new this.emailDocumentModel(document);
    return createdDocument.save();
  }

  async findByFilename(filename: string): Promise<EmailDocument> {
    return this.emailDocumentModel.findOne({ filename }).exec();
  }
}
