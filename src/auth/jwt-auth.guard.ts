import { Injectable ,UnauthorizedException,ExecutionContext} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import Role from './role.enum';
import { ROLES_KEY } from './roles.decorator';
import { Reflector } from '@nestjs/core';


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

}
