import { Connection, createConnection, getConnection, getManager, QueryRunner } from 'typeorm';
import dayjs from 'dayjs';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';


export const connect = async () => {
  const connectionOptions: PostgresConnectionOptions = {
    name: 'default',
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 7432),
    username: 'postgres',
    password: 'postgres',
    database: process.env.DB_NAME || 'aou-local',
    synchronize: false
  };
  try {
    return getConnection('default');
  } catch (error) {
    return createConnection(connectionOptions);
  }
};

/*
Map symbol => id for those instruments that participate in testing
 */
export const instrumentsMap: { [symbol: string]: string } = {};

/**
 * Refreshes the map symbol => id
 */
export const refreshInstrumentsMap = async (): Promise<void> => {
  const result = await getManager().query(
    'SELECT id, symbol FROM instruments.inst WHERE symbol IN (\'MSFT\',  \'QQQ\', \'GOOG\', \'AAPL\', \'SPY\');'
  );
  result.forEach(({ id, symbol }: { id: string; symbol: string }) => {
    instrumentsMap[symbol] = id;
  });
};

/**
 * Cleans up data for those instruments that participate in testing
 */
const initInstruments = async (queryRunner: QueryRunner): Promise<void> => {
  // 13252: MSFT, 1: QQQ, 12246: GOOG, 2662: AAPL, 4: SPY
  const idListAAPLnSPY = ['AAPL', 'SPY'].map(s => instrumentsMap[s]).filter(v => v).join(',') || '0';
  const idListMSFTnQQQnGOOG = ['MSFT', 'QQQ', 'GOOG'].map(s => instrumentsMap[s]).filter(v => v).join(',') || '0';

  const fkTables: [string, string[]][] = [
    ['launchpad', ['commstack_inst', 'inst_scalar_props', 'theme_inst', 'hunch', 'stack_inst']],
    ['instruments', ['inst_feed']],
  ];
  const deleteSQLarr: string[] = [];
  fkTables.forEach(([schema, tables]) => {
    tables.forEach(table => {
      deleteSQLarr.push(`DELETE
                         FROM ${schema}.${table}
                         WHERE inst_id IN (${idListAAPLnSPY});`
      );
    });
  });
  const deleteSQL = deleteSQLarr.join('\n');

  await queryRunner.query(`
      DELETE
      FROM marketdata.stock_prices_daily
      WHERE inst_id IN (${idListMSFTnQQQnGOOG})
        AND feed = 'MORNING_STAR';

      DELETE
      FROM marketdata.stock_prices_daily
      WHERE inst_id IN (${idListAAPLnSPY});

      DELETE
      FROM instruments.inst_feed
      WHERE inst_id IN (${idListMSFTnQQQnGOOG})
        AND feed = 'MORNING_STAR';

      ${deleteSQL}

      DELETE
      FROM instruments.inst
      WHERE id IN (${idListAAPLnSPY});

      INSERT INTO instruments.inst_feed (inst_id, feed) VALUES
        ${idListMSFTnQQQnGOOG.split(',').map(i => `(${i}, 'MORNING_STAR')`).join(',')};
    `
  );
};

/**
 * Fills in price data for the instruments specified in the array ID
 * from 1-Jan-2000 to the date specified in tillDate (in format YYYY-MM-DD)
 */
const fillDailyBars = async (queryRunner: QueryRunner, symbols: string[], tillDate: string): Promise<void> => {
  const instrIdList = symbols.map(s => instrumentsMap[s]).filter(v => v).join(',') || '0';
  await queryRunner.query(`
      DELETE
      FROM marketdata.stock_prices_daily
      WHERE inst_id IN (${instrIdList});

      insert into marketdata.stock_prices_daily
      with DD as (
        with D as (
          select time,
                 inst_id,
                 extract(DOW from time)                                                                    dw,
                 10 * sin(pi() * extract(epoch from (time - '1-Jan-2000'::date)) / (10 * 24 * 3600)) + 100 price
          FROM generate_series('1-Jan-2000'::date, '${tillDate}'::date, interval '1 day') AS g1(time),
               (select id from instruments.inst WHERE id IN (${instrIdList})) AS g2(inst_id)
          order by time
        )
        select time,
               inst_id,
               (fmod(inst_id::double precision * 0.7, 1) * fmod(inst_id, 20) * price +
                mod(inst_id, 100))::numeric(6, 2) price
        from D
        where dw not in (6, 0)
      )
      select time::date     as ts_date,
             inst_id,
             price + 0.01      price_open,
             price + 0.05      price_close,
             price + 0.02      price_high,
             price             price_low,
             'MORNING_STAR' as feed
      from DD;

      REFRESH MATERIALIZED VIEW marketdata.view_stock_prices_last;
    `
  );
};


/*
 'MSFT', 'QQQ' - fill up with  price data to (now - 14d)
 'GOOG' - without price data
 'AAPL', 'SPY' - delete completely (both prices and instrument records)
 */
export const prepareData = async (): Promise<QueryRunner> => {
  const connection: Connection = getConnection();
  const queryRunner = connection.createQueryRunner();
  await queryRunner.connect();

  await refreshInstrumentsMap();
  await initInstruments(queryRunner);
  const tillDate: string = dayjs().add(-14, 'days').format('YYYY-MM-DD');
  await fillDailyBars(queryRunner, ['MSFT', 'QQQ'], tillDate);
  return queryRunner;
};

