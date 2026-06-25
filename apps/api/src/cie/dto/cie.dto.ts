import { CieActivityType, CieReturnStatus, CieWorkGroup } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class CieDayQueryDto {
  @IsEnum(CieWorkGroup)
  group!: CieWorkGroup;

  @IsDateString()
  date!: string;
}

export class CieMonthQueryDto {
  @IsEnum(CieWorkGroup)
  group!: CieWorkGroup;

  @Type(() => Number)
  @IsInt()
  @Min(2026)
  year!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month!: number;
}

export class UpdateCieTaskDto {
  @IsString()
  @IsOptional()
  workOrder?: string;

  @IsString()
  @IsOptional()
  equipment?: string;

  @IsString()
  @IsOptional()
  plant?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  durationHours?: number;

  @IsArray()
  @IsEnum(CieActivityType, { each: true })
  @IsOptional()
  activityTypes?: CieActivityType[];

  @IsDateString()
  @IsOptional()
  scheduledDate?: string;

  @IsString()
  @IsOptional()
  rescheduleReason?: string;
}

export class CieTaskReturnInputDto {
  @IsString()
  @IsNotEmpty()
  scheduledTaskId!: string;

  @IsEnum(CieReturnStatus)
  status!: CieReturnStatus;

  @IsString()
  @IsOptional()
  observations?: string;
}

export class SubmitCieDayReturnsDto {
  @IsEnum(CieWorkGroup)
  group!: CieWorkGroup;

  @IsDateString()
  date!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CieTaskReturnInputDto)
  returns!: CieTaskReturnInputDto[];
}

export class ExtendCieHorizonDto {
  @Type(() => Number)
  @IsInt()
  @Min(2026)
  endYear!: number;
}
