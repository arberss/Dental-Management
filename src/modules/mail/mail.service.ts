import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  sendMail(data: {
    to: string;
    subject: string;
    template: string;
    context: { [key: string]: any };
  }) {
    return this.mailerService.sendMail({
      from: this.configService.get<string>('EMAIL_ID'),
      ...data,
    });
  }
}
