import { CallHandler } from '@nestjs/common';
import { tap, throwError } from 'rxjs';

const SUCCESS_THRESHOLD = 3; // the number of successful operations above which we close the circuit
const FAILURE_THRESHOLD = 3; //the number of failures after which we open circuit
const OPEN_TO_HALF_OPEN_WAIT_TIME = 6000; // 1 minute in ms

enum CircuitBreakerState {
  Closed,
  Open,
  HalfOpen, //when circuit breaker is transitioning from closed to open or open to closed
}

export class CircuitBreaker {
  private state = CircuitBreakerState.Closed;
  private failureCount = 0;
  private successCount = 0;
  private lastError: Error | null = null;
  private nextAttempt: number;

  exec(next: CallHandler) {
    if (this.state === CircuitBreakerState.Open) {
      if (this.nextAttempt > Date.now()) {
        return throwError(() => this.lastError);
      }
      this.state = CircuitBreakerState.HalfOpen;
    }
    return next.handle().pipe(
      tap({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err),
      }),
    );
  }

  private handleSuccess() {
    this.failureCount = 0;

    if (this.state === CircuitBreakerState.HalfOpen) {
      this.successCount++;

      if (this.successCount >= SUCCESS_THRESHOLD) {
        this.successCount = 0;
        this.state = CircuitBreakerState.Closed;
      }
    }
  }

  private handleError(err: Error) {
    this.failureCount++;

    if (
      this.failureCount >= FAILURE_THRESHOLD ||
      this.state === CircuitBreakerState.HalfOpen
    ) {
      this.state = CircuitBreakerState.Open;
      this.lastError = err;
      this.nextAttempt = Date.now() + OPEN_TO_HALF_OPEN_WAIT_TIME;
    }
  }
}
