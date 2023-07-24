import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { SupabaseStrategy } from './provider/supabase/strategy/supabase.strategy';
import authConfig from 'src/config/auth.config';
import { UserModule } from '../user/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, SupabaseStrategy],
})
export class AuthenticationModule {}
