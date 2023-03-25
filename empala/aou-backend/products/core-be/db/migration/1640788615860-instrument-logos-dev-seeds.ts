import { MigrationInterface, QueryRunner } from 'typeorm';

export class InstrumentLogosDevSeeds1640788615860 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO instruments.logos (
        inst_id, logo, logo_original, logo_normal, logo_thumbnail, logo_square, logo_square_strict
      ) VALUES (
        10032,
        'https://some-test-url/logo',
        'https://some-test-url/logo_original',
        'https://some-test-url/logo_normal',
        'https://some-test-url/logo_thumbnail',
        'https://some-test-url/logo_square',
        'https://some-test-url/logo_square_strict'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM instruments.logos WHERE inst_id = 10032 AND
        logo LIKE 'https://some-test-url%';
    `);
  }
}
