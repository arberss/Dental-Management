import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PatientModule } from './modules/patient/patient.module';
import { TreatmentModule } from './modules/treatment/treatment.module';
import { MailService } from './modules/mail/mail.service';
import { MailModule } from './modules/mail/mail.module';
import { SchedulerModule } from './modules/scheduler/scheduler.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    PatientModule,
    TreatmentModule,
    MailModule,
    SchedulerModule,
  ],
  controllers: [],
  providers: [MailService],
})
export class AppModule {}
