import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { SubscriptionsService } from './subscriptions.service';
import { EventContext } from 'src/payment/context/event-context';

@Module({
  providers: [NotificationsService, SubscriptionsService, EventContext],
})
export class PaymentsModule {}
