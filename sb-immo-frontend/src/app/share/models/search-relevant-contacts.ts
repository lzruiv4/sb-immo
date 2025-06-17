import { IContactDto } from '../../models/dtos/contact.dto';

export interface ISearchRelevantContact {
  owners: IContactDto[];
  renters: IContactDto[];
  serviceProviders: IContactDto[];
}

export interface ISearchRelevantContactID {
  ownerIds: string[];
  renterIds: string[];
  serviceProviderIds: string[];
}


