import { ITag } from '../../share/models/tag.model';

export enum PropertyStatusType {
  AVAILABLE = 'AVAILABLE',
  RENTED = 'RENTED',
  MAINTENANCE = 'MAINTENANCE',
}

export const PropertyStatusDescriptions: Record<PropertyStatusType, ITag> = {
  [PropertyStatusType.AVAILABLE]: { label: 'AVAILABLE', severity: 'success' },
  [PropertyStatusType.RENTED]: { label: 'RENTED', severity: 'info' },
  [PropertyStatusType.MAINTENANCE]: { label: 'MAINTENANCE', severity: 'warn' },
};
