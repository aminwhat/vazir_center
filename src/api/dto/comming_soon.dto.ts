import { IsNotEmpty, IsString } from 'class-validator';

export class CommingSoonDto {
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  ip: string;
}
