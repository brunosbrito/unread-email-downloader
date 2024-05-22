import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from './emails/email.module';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_URI), EmailModule],
})
export class AppModule {}
