import {
  ActionType,
  FindingPriority,
  FindingStatus,
  FindingType,
  CorrectiveActionStatus,
} from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class CorrectiveActionInputDto {
  @IsEnum(ActionType)
  type!: ActionType;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsDateString()
  dueDate!: string;

  @IsString()
  @IsNotEmpty()
  responsibleId!: string;
}

export class FiveWhysStepInputDto {
  @IsNotEmpty()
  level!: number;

  @IsString()
  @IsNotEmpty()
  question!: string;

  @IsString()
  @IsNotEmpty()
  answer!: string;
}

export class CreateFindingDto {
  @IsEnum(FindingType)
  type!: FindingType;

  @IsEnum(FindingPriority)
  @IsOptional()
  priority?: FindingPriority;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsOptional()
  area?: string;

  @IsString()
  @IsOptional()
  sector?: string;

  @IsString()
  @IsOptional()
  locationDetail?: string;

  @IsDateString()
  @IsOptional()
  occurredAt?: string;

  @IsObject()
  typeDetails!: Record<string, unknown>;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  reporterName!: string;

  @IsEmail()
  reporterEmail!: string;

  @IsString()
  @IsOptional()
  @MaxLength(120)
  reporterPosition?: string;

  @IsString()
  @IsNotEmpty()
  assigneeId!: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  viewerIds?: string[];

  /** Correos adicionales para notificación (no requieren usuario en el sistema) */
  @IsArray()
  @IsEmail({}, { each: true })
  @IsOptional()
  notificationEmails?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CorrectiveActionInputDto)
  @IsOptional()
  actions?: CorrectiveActionInputDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FiveWhysStepInputDto)
  @IsOptional()
  fiveWhysSteps?: FiveWhysStepInputDto[];

  @IsString()
  @IsOptional()
  rootCause?: string;

  @IsString()
  @IsOptional()
  rootCauseMeasures?: string;
}

export class UpdateFindingStatusDto {
  @IsEnum(FindingStatus)
  status!: FindingStatus;

  @IsString()
  @IsOptional()
  comment?: string;
}

export class CreateFindingNoteDto {
  @IsString()
  @IsNotEmpty()
  content!: string;
}

export class UpdateFiveWhysDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => FiveWhysStepInputDto)
  steps!: FiveWhysStepInputDto[];

  @IsString()
  @IsOptional()
  rootCause?: string;

  @IsString()
  @IsOptional()
  rootCauseMeasures?: string;
}

export class UpdateCorrectiveActionDto {
  @IsEnum(CorrectiveActionStatus)
  @IsOptional()
  status?: CorrectiveActionStatus;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;
}

export class CreateCorrectiveActionDto {
  @IsEnum(ActionType)
  type!: ActionType;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsDateString()
  dueDate!: string;

  @IsString()
  @IsNotEmpty()
  responsibleId!: string;
}
