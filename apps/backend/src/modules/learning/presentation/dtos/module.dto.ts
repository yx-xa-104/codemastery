import { IsString, IsOptional, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateModuleDto {
    @ApiProperty({ example: 'Nhập môn Python' })
    @IsString()
    title: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    sort_order?: number;
}

export class UpdateModuleDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    sort_order?: number;
}

export class ReorderModulesDto {
    @ApiProperty({ type: [Object], example: [{ id: 'uuid', sort_order: 0 }] })
    items: { id: string; sort_order: number }[];
}
