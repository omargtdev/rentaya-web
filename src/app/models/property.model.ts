export type PropertyStatus = 'Disponible' | 'Inactivo';

export interface Property {
  id: number;
  ownerId: number;
  ownerName: string;
  title: string;
  district: string;
  address: string;
  price: number;
  rooms: number;
  bathrooms: number;
  area?: number;
  description: string;
  photos: string[];
  status: PropertyStatus;
  createdAt: string;
}

export interface PropertyFilters {
  district?: string;
  minPrice?: number | null;
  maxPrice?: number | null;
}

export type PropertyFormValue = Omit<Property, 'id' | 'ownerId' | 'ownerName' | 'status' | 'createdAt'>;
