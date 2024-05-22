import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class EmailDocument extends Document {
  @Prop()
  date: Date;

  @Prop()
  filename: string;

  @Prop()
  contentFile: string;
}

export const EmailDocumentSchema = SchemaFactory.createForClass(EmailDocument);
