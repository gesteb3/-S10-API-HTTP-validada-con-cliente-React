import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';
import { Medicine } from './entities/medicine.entity';

@Injectable()
export class MedicinesService {
  private readonly medicines: Medicine[] = [];

  findAll(): Medicine[] {
    return this.medicines.map((medicine) => ({ ...medicine }));
  }

  findOne(id: string): Medicine {
    const medicine = this.medicines.find((item) => item.id === id);
    if (!medicine) {
      throw new NotFoundException(`Medicine with id ${id} was not found`);
    }
    return { ...medicine };
  }

  create(dto: CreateMedicineDto): Medicine {
    this.assertUniqueSku(dto.sku);
    const timestamp = new Date().toISOString();
    const medicine: Medicine = {
      id: randomUUID(),
      ...dto,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.medicines.push(medicine);
    return { ...medicine };
  }

  update(id: string, dto: UpdateMedicineDto): Medicine {
    const index = this.medicines.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`Medicine with id ${id} was not found`);
    }
    if (dto.sku) this.assertUniqueSku(dto.sku, id);
    const updated = {
      ...this.medicines[index],
      ...dto,
      updatedAt: new Date().toISOString(),
    };
    this.medicines[index] = updated;
    return { ...updated };
  }

  remove(id: string): void {
    const index = this.medicines.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`Medicine with id ${id} was not found`);
    }
    this.medicines.splice(index, 1);
  }

  private assertUniqueSku(sku: string, ignoredId?: string): void {
    const exists = this.medicines.some(
      (item) => item.sku === sku && item.id !== ignoredId,
    );
    if (exists) throw new ConflictException(`SKU ${sku} already exists`);
  }
}

