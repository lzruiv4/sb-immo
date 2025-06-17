import { ITag } from '../../share/models/tag.model';

export enum RoleType {
  ROLE_OWNER = 'OWNER',
  ROLE_RENTER = 'RENTER',
  ROLE_SERVICE_PROVIDER = 'SERVICE_PROVIDER',
}

export const RoleTypeDescriptions: Record<RoleType, ITag> = {
  [RoleType.ROLE_OWNER]: { label: 'OWNER', severity: 'success' },
  [RoleType.ROLE_RENTER]: { label: 'RENTER', severity: 'info' },
  [RoleType.ROLE_SERVICE_PROVIDER]: {
    label: 'SERVICE_PROVIDER',
    severity: 'warn',
  },
};
