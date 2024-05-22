import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailService } from './email.services';
import { EmailController } from './email.controller';
import { EmailRepository } from './email.repository';
import { EmailDocument, EmailDocumentSchema } from './email-document.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmailDocument.name, schema: EmailDocumentSchema },
    ]),
  ],
  providers: [EmailService, EmailRepository],
  controllers: [EmailController],
})
export class EmailModule {}
