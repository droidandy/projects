import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameSymbolBrka1642078310941 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('UPDATE instruments.inst SET symbol = \'BRK.A\' WHERE id = 30002');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('UPDATE instruments.inst SET symbol = \'BRKA\' WHERE id = 30002');
  }
}
