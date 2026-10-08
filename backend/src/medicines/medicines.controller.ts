import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { Medicine } from './entities/medicine.entity';
import { MedicinesService } from './medicines.service';

@ApiTags('medicines')
@Controller('medicines')
export class MedicinesController {
  constructor(private readonly medicinesService: MedicinesService) {}

  @Get()
  @ApiOkResponse({ type: Medicine, isArray: true })
  findAll() {
    return this.medicinesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: Medicine })
  @ApiBadRequestResponse({ description: 'The id is not a UUID' })
  @ApiNotFoundResponse({ description: 'Medicine not found' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.medicinesService.findOne(id);
  }

  @Post()
  @ApiCreatedResponse({ type: Medicine })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ApiConflictResponse({ description: 'SKU already exists' })
  create(@Body() dto: CreateMedicineDto) {
    return this.medicinesService.create(dto);
  }

  @Patch(':id')
  @ApiOkResponse({ type: Medicine })
  @ApiBadRequestResponse({ description: 'Invalid id or body' })
  @ApiNotFoundResponse({ description: 'Medicine not found' })
  @ApiConflictResponse({ description: 'SKU already exists' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateMedicineDto,
  ) {
    return this.medicinesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Medicine deleted' })
  @ApiBadRequestResponse({ description: 'The id is not a UUID' })
  @ApiNotFoundResponse({ description: 'Medicine not found' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    this.medicinesService.remove(id);
  }
}

