export type VisitStatus = 'Pendiente' | 'Aceptada' | 'Rechazada';

export interface Visit {
  id: number;
  propertyId: number;
  propertyTitle: string;
  tenantId: number;
  tenantName: string;
  ownerId: number;
  date: string;
  time: string;
  status: VisitStatus;
  createdAt: string;
}
