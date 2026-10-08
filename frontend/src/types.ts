export interface Medicine {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  requiresPrescription: boolean;
  createdAt: string;
  updatedAt: string;
}

export type MedicineInput = Pick<
  Medicine,
  'name' | 'sku' | 'price' | 'stock' | 'requiresPrescription'
>;

export interface ApiErrorBody {
  statusCode?: number;
  message?: string | string[];
  error?: string;
}

