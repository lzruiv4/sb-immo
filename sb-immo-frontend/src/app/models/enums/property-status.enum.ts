import { ITag } from '../../share/models/tag.model';

export enum PropertyStatusType {
  AVAILABLE = 'Verfügbar',
  RENTED = 'Vermietet',
  MAINTENANCE = 'Wartung',
}

export const PropertyStatusDescriptions: Record<PropertyStatusType, ITag> = {
  [PropertyStatusType.AVAILABLE]: { label: 'AVAILABLE', severity: 'success' },
  [PropertyStatusType.RENTED]: { label: 'MAINTENANCE', severity: 'warn' },
  [PropertyStatusType.MAINTENANCE]: { label: 'RENTED', severity: 'info' },
};
