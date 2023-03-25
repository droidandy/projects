import { MigrationInterface, QueryRunner } from 'typeorm';

export class AOU870DeleteViewStockPricesLastDates1641910007611 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      drop view marketdata.view_stock_prices_last_dates;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE OR REPLACE VIEW marketdata.view_stock_prices_last_dates
        AS
        SELECT MAX(ts_date) AS "lastPriceDate", inst_id, feed
        FROM marketdata.stock_prices_daily
        GROUP BY inst_id, feed;

    `);
  }
}
