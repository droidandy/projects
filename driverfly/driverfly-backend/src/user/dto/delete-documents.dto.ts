import { ApiProperty } from '@nestjs/swagger';

export class DeleteDocumentDto {
  @ApiProperty({
    description: 'Send the type of document you want to delete',
  })
  type: string;
}
