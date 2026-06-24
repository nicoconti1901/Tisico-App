import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import {
  CreateCorrectiveActionDto,
  CreateFindingDto,
  CreateFindingNoteDto,
  UpdateCorrectiveActionDto,
  UpdateFindingStatusDto,
  UpdateFiveWhysDto,
} from './dto/finding.dto';
import { FindingsService } from './findings.service';

@Controller('findings')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN, Role.SUPERVISOR, Role.OPERATOR)
export class FindingsController {
  constructor(private readonly findingsService: FindingsService) {}

  @Get('notification-defaults')
  listNotificationDefaults() {
    return this.findingsService.listNotificationDefaults();
  }

  @Get('assignable-users')
  listAssignableUsers() {
    return this.findingsService.listAssignableUsers();
  }

  @Get()
  findAll() {
    return this.findingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findingsService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateFindingDto, @CurrentUser() user: AuthUser) {
    return this.findingsService.create(dto, user);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateFindingStatusDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.findingsService.updateStatus(id, dto, user);
  }

  @Post(':id/notes')
  addNote(
    @Param('id') id: string,
    @Body() dto: CreateFindingNoteDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.findingsService.addNote(id, dto, user);
  }

  @Patch(':id/five-whys')
  updateFiveWhys(@Param('id') id: string, @Body() dto: UpdateFiveWhysDto) {
    return this.findingsService.updateFiveWhys(id, dto);
  }

  @Post(':id/actions')
  addAction(@Param('id') id: string, @Body() dto: CreateCorrectiveActionDto) {
    return this.findingsService.addAction(id, dto);
  }

  @Patch(':id/actions/:actionId')
  updateAction(
    @Param('id') id: string,
    @Param('actionId') actionId: string,
    @Body() dto: UpdateCorrectiveActionDto,
  ) {
    return this.findingsService.updateAction(id, actionId, dto);
  }

  @Post(':id/attachments')
  @UseInterceptors(FileInterceptor('file'))
  addAttachment(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: AuthUser,
  ) {
    if (!file) {
      throw new BadRequestException('Archivo requerido');
    }
    return this.findingsService.addAttachment(id, file, user);
  }

  @Get(':id/attachments/:attachmentId/url')
  getAttachmentUrl(
    @Param('id') id: string,
    @Param('attachmentId') attachmentId: string,
  ) {
    return this.findingsService.getAttachmentUrl(id, attachmentId);
  }
}
