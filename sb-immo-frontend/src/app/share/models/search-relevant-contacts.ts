import { IContactDto } from '../../models/dtos/contact.dto';

export interface ISearchRelevantContact {
  contact: IContactDto;
  owners: IContactDto[];
  renters: IContactDto[];
  serviceProviders: IContactDto[];
}

export interface ISearchRelevantContactID {
  contactId: string;
  ownerIds: string[];
  renterIds: string[];
  serviceProviderIds: string[];
}
