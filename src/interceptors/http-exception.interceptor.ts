import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { catchError, throwError, TimeoutError, timeout } from 'rxjs';
import { HttpException, RequestTimeoutException } from '@nestjs/common';

@Injectable()
export class HttpExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      timeout(5000),
      catchError((error) => {
        if (error instanceof TimeoutError) {
          return throwError(
            () => new RequestTimeoutException('External request timeout'),
          );
        }

        if (error.response) {
          const { status, data } = error.response;
          return throwError(
            () => new HttpException(data || 'External request failed', status),
          );
        }

        return throwError(
          () => new HttpException('Unexpected external request error', 500),
        );
      }),
    );
  }
}
