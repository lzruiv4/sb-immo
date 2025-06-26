import { IPropertyRecord } from '../../models/property-record.model';

export interface ISearchRelevantContact {
  owners: IPropertyRecord[];
  renters: IPropertyRecord[];
  serviceProviders: IPropertyRecord[];
}
