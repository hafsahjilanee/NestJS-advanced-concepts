import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { OnEvent } from '@nestjs/event-emitter';
import { EventContext } from 'src/payment/context/event-context';
import { PaymentFailedEvent } from 'src/payment/events/payment-failed.event';

@Injectable()
export class NotificationsService {
  constructor(private readonly moduleRef: ModuleRef) {}
  @OnEvent(PaymentFailedEvent.key)
  async sendPaymentNotification(event: PaymentFailedEvent) {
    console.log('event: ', event);
    const eventContext = await this.moduleRef.resolve(
      EventContext,
      event.meta.contextId,
    );

    console.log('sending a payment notification', eventContext.request.url);
  }
}
