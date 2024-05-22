import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { EmailService } from './email.services';
import { EmailDocument } from './email-document.schema';
import { EmailDto } from './email.dto';

@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('getDocuments')
  async getDocuments(@Body() payload: EmailDto): Promise<EmailDocument[]> {
    return this.emailService.getDocuments(payload);
  }

  @Get('getInfoDocument/:filename')
  async getInfoDocument(@Param('filename') filename: string) {
    return this.emailService.getDocumentInfo(filename);
  }
}
