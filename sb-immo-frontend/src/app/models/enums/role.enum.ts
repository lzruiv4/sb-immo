import { ITag } from '../../share/models/tag.model';

export enum RoleType {
  ROLE_OWNER = 'OWNER',
  ROLE_RENTER = 'RENTER',
  ROLE_SERVICE = 'SERVICE',
}

export const RoleTypeDescriptions: Record<RoleType, ITag> = {
  [RoleType.ROLE_OWNER]: { label: 'OWNER', severity: 'success' },
  [RoleType.ROLE_RENTER]: { label: 'RENTER', severity: 'info' },
  [RoleType.ROLE_SERVICE]: {
    label: 'SERVICE',
    severity: 'warn',
  },
};
