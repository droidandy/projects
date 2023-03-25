import { MigrationInterface, QueryRunner } from 'typeorm';

const URL_MAX_LENGTH = 2048;

export class AOU804AddInstrumentLogos1637940681535 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE instruments.logos (
        id BIGINT GENERATED ALWAYS AS IDENTITY,
        inst_id BIGINT UNIQUE,
        logo character varying(${URL_MAX_LENGTH}),
        logo_original character varying(${URL_MAX_LENGTH}),
        logo_normal character varying(${URL_MAX_LENGTH}),
        logo_thumbnail character varying(${URL_MAX_LENGTH}),
        logo_square character varying(${URL_MAX_LENGTH}),
        logo_square_strict character varying(${URL_MAX_LENGTH})
      );
      
      ALTER TABLE instruments.logos 
        ADD CONSTRAINT pkey_logos_id PRIMARY KEY (id);

      ALTER TABLE instruments.logos 
        ADD CONSTRAINT unique_inst_id UNIQUE (inst_id);
      
      ALTER TABLE instruments.logos
        ADD CONSTRAINT fkey_inst_id FOREIGN KEY (inst_id) REFERENCES instruments.inst(id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE IF EXISTS instruments.logos; 
      `);
  }
}
