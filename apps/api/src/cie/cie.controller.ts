import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CieWorkGroup, Role } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import {
  ExtendCieHorizonDto,
  SubmitCieDayReturnsDto,
  UpdateCieTaskDto,
} from './dto/cie.dto';
import { CieService } from './cie.service';

@Controller('cie')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN, Role.SUPERVISOR, Role.OPERATOR)
export class CieController {
  constructor(private readonly cieService: CieService) {}

  @Get('meta')
  getMeta() {
    return this.cieService.getMeta();
  }

  @Get('config')
  getConfig() {
    return this.cieService.getConfig();
  }

  @Get('day')
  getDay(
    @Query('group') group: CieWorkGroup,
    @Query('date') date: string,
  ) {
    return this.cieService.getDayView(group, date);
  }

  @Get('month')
  getMonth(
    @Query('group') group: CieWorkGroup,
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    return this.cieService.getMonthView(group, Number(year), Number(month));
  }

  @Patch('tasks/:id')
  updateTask(@Param('id') id: string, @Body() dto: UpdateCieTaskDto) {
    return this.cieService.updateTask(id, dto);
  }

  @Post('returns/day')
  submitReturns(
    @Body() dto: SubmitCieDayReturnsDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.cieService.submitDayReturns(dto, user);
  }

  @Post('horizon/extend')
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  extendHorizon(@Body() dto: ExtendCieHorizonDto) {
    return this.cieService.extendHorizon(dto);
  }
}
