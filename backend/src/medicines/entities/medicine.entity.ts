import { ApiProperty } from '@nestjs/swagger';

export class Medicine {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Paracetamol 500 mg' })
  name: string;

  @ApiProperty({ example: 'PAR-500' })
  sku: string;

  @ApiProperty({ example: 3.5 })
  price: number;

  @ApiProperty({ example: 25 })
  stock: number;

  @ApiProperty({ example: true })
  requiresPrescription: boolean;

  @ApiProperty({ format: 'date-time' })
  createdAt: string;

  @ApiProperty({ format: 'date-time' })
  updatedAt: string;
}

