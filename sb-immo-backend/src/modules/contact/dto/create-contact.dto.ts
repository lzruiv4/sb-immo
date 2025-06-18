import { ApiProperty } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiProperty()
  firstname: string;
  @ApiProperty()
  lastname: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  notes?: string;
}
