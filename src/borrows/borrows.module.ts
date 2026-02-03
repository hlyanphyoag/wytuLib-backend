import { Module } from '@nestjs/common';
import { BorrowsService } from './borrows.service';
import { BorrowsController } from './borrows.controller';
import { borrowSchedulerService } from './scheduler/borrow.scheduler';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [BorrowsController],
  providers: [BorrowsService, borrowSchedulerService],
})
export class BorrowsModule {}
