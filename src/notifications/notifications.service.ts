import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { welcomeEmailTemplate } from './templates/welcome-template';
import { BookBorrowedData, bookBorrowedTemplate } from './templates/borrow-template';
import { OverdueData, overdueTemplate } from './templates/overdue-template';
import { bookDueTomorrowTemplate } from './templates/overdue-alert-template';
import { BookReturnedData, bookReturnedTemplate } from './templates/return-template';

@Injectable()
export class NotificationsService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend("re_NAJVjP9h_DnkhqSRkXYuM8wCmuKg6Lznf");
  }

  async sendEmail(to: string, subject: string, html: string) {
    try {
      const data = await this.resend.emails.send({
        from: 'WYTU Library | Library Team <noreply@quickposofme.shop>',
        to: [to],
        subject: subject,
        html: html,
      });

      return data;
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  async sendWelcomeEmail(to: string, name: string) {
    const welcomeHtml = welcomeEmailTemplate(name)
    return this.sendEmail(to, 'Welcome to Our App', welcomeHtml);
  }

  async sendBorrowEmail(data: BookBorrowedData) {
    const borrowHtml = bookBorrowedTemplate(data)
    return this.sendEmail(data.email!, 'Book Borrowed Confirmation!', borrowHtml);
  }

  async sendBeforeOverdueEmail(data: BookBorrowedData) {
    const overDueAlertHtml = bookDueTomorrowTemplate(data)
    return this.sendEmail(data.email!, 'Book Due Tomorrow Alert!', overDueAlertHtml)
  }

  async sendOverdueEmail(data: OverdueData) {
    const overDueHtml = overdueTemplate(data)
    return this.sendEmail(data.email!, 'Overdue Book Alert!', overDueHtml)
  }

  async sendBookReturnEmail(data: BookReturnedData) {
    const returnHtml = bookReturnedTemplate(data)
    return this.sendEmail(data.email!, 'Book Return Confirmation!', returnHtml)
  }
}