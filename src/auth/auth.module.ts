import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { NotificationsModule } from 'src/notifications/notifications.module';


@Module({
  imports: [
    JwtModule.register({
      secret: 'secret',
      global: true
    }),
    UsersModule,
    DatabaseModule,
    NotificationsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
