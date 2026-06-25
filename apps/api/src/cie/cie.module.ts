import { Module } from '@nestjs/common';
import { CieController } from './cie.controller';
import { CieService } from './cie.service';

@Module({
  controllers: [CieController],
  providers: [CieService],
})
export class CieModule {}
