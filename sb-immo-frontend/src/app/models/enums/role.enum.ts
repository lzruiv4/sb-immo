import { ITag } from '../../share/models/tag.model';

export enum RoleType {
  ROLE_EIGENTUEMER = 'Eigentümer',
  ROLE_MIETER = 'Mieter',
  ROLE_DIENSTLEISTER = 'Dienstleister',
}

export const RoleTypeDescriptions: Record<RoleType, ITag> = {
  [RoleType.ROLE_EIGENTUEMER]: { label: 'EIGENTÜMER', severity: 'success' },
  [RoleType.ROLE_MIETER]: { label: 'MIETER', severity: 'info' },
  [RoleType.ROLE_DIENSTLEISTER]: { label: 'DIENSTLEISTER', severity: 'warn' },
};
