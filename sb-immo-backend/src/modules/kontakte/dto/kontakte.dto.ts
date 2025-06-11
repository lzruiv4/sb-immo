export class CreateKontakteDto {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  role: 'EIGENTUEMER' | 'MIETER' | 'DIENSTLEISTER';
  notes?: string;

  //   constructor(partial: Partial<KontakteDto>) {
  //     Object.assign(this, partial);
  //   }
}
