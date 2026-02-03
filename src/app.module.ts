import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guards/auth.guard';
import { RolesGuard } from './common/guards/role.guard';
import { ImageKitModule } from './imageKit/imageKit.module';
import { BooksModule } from './books/books.module';
import { BorrowsModule } from './borrows/borrows.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ReviewsModule } from './reviews/reviews.module';
import { AuthorsModule } from './authors/authors.module';
import { CategoryModule } from './category/category.module';
import { NotificationsModule } from './notifications/notifications.module';
import { DashboardModule } from './dashboard/dashboard.module';


@Module({
  imports: [
    AuthModule,
    UsersModule,
    AuthorsModule,
    CategoryModule,
    BooksModule,
    DatabaseModule,
    JwtModule,
    BorrowsModule,
    ReviewsModule,
    ImageKitModule,
    ScheduleModule.forRoot(),
    NotificationsModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    },
    AppService
  ],
})
export class AppModule { }
