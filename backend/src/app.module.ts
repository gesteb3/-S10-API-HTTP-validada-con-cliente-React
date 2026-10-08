import { Module } from '@nestjs/common';
import { MedicinesModule } from './medicines/medicines.module';

@Module({ imports: [MedicinesModule] })
export class AppModule {}

