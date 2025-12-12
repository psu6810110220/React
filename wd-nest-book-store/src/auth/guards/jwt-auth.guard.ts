import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // Check if auth is enabled via environment variable
    const authEnabled = process.env.AUTH_ENABLED === 'true';
    
    if (!authEnabled) {
      // If auth is disabled, allow all requests
      return true;
    }

    // Check for public decorator (for routes that should be public even when auth is enabled)
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // If auth is enabled and route is not public, use JWT guard
    return super.canActivate(context);
  }
}

