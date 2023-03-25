/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class marketdata1637236430341 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      drop function if exists fmod;
        CREATE FUNCTION fmod (
          dividend double precision,
          divisor double precision
        ) RETURNS double precision
        LANGUAGE sql IMMUTABLE AS
        'SELECT dividend - floor(dividend / divisor) * divisor';

      insert into marketdata.stock_prices_daily
        with DD as (
          with D as (
            select time,
              inst_id,
              extract(DOW from time) dw,
              10 * sin(pi() * extract(epoch from (time - '1-Jan-2000'::date)) / (10 * 24 * 3600)) + 100 price
            FROM
              generate_series('1-Jan-2000'::date, '1-Jan-2024'::date, interval '1 day') AS g1(time),
              (select id
                from instruments.inst
                where symbol = ANY (ARRAY ['MSFT','AAPL','AMZN','FB','V','GOOG','TSLA','BRK.B','NVDA','JPM','QQQ','SPY','VTI','VOO']::varchar[])
              ) AS g2(inst_id)
            order by time
          )
          select
            time,
            inst_id,
            (fmod(inst_id::double precision * 0.7, 1) * fmod(inst_id, 20) * price + mod(inst_id, 100))::numeric(6, 2) price
          from D
          where dw not in (6, 0)
        )
        select
          time::date as ts_date,
          inst_id,
          price + 0.01 price_open,
          price + 0.05 price_close,
          price + 0.02 price_high,
          price price_low,
          'MORNING_STAR' as feed
        from DD;

      REFRESH MATERIALIZED VIEW marketdata.view_stock_prices_last;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    //
  }
}
