import { Connection, createConnection, getConnection, QueryRunner } from 'typeorm';
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

const usedSymbols = ['LI', 'PLUG', 'A1999', 'A199999', 'MSFT', 'GOOG', 'AAPL'];

/*
Map symbol => id for those instruments that participate in testing
 */
export const instrumentsMap: { [symbol: string]: string } = {};

/**
 * Refreshes the map symbol => id
 */
export const refreshInstrumentsMap = async (queryRunner: QueryRunner, symbols: string[]): Promise<void> => {
  const result = await queryRunner.query(
    `SELECT id, symbol
     FROM instruments.inst
     WHERE symbol IN (${symbols.map(v => `'${v}'`).join(', ')});`
  );
  result.forEach(({ id, symbol }: { id: string; symbol: string }) => {
    instrumentsMap[symbol] = id;
  });
};

/**
 * Cleans up data for those instruments that participate in testing
 */
const deleteInstruments = async (queryRunner: QueryRunner, symbols: string[]): Promise<void> => {
  await refreshInstrumentsMap(queryRunner, symbols);
  const ids = symbols.map(s => instrumentsMap[s]).filter(v => v).join(',') || '0';

  const fkTables: [string, string[]][] = [
    ['launchpad', ['commstack_inst', 'inst_scalar_props', 'theme_inst', 'hunch', 'stack_inst']],
    ['marketdata', ['stock_prices_daily']],
    ['instruments', ['inst_feed']],
  ];
  const deleteSQLarr: string[] = [];
  fkTables.forEach(([schema, tables]) => {
    tables.forEach(table => {
      deleteSQLarr.push(`DELETE
                         FROM ${schema}.${table}
                         WHERE inst_id IN (${ids});`);
    });
  });
  const deleteSQL = deleteSQLarr.join('\n');
  await queryRunner.query(`
    ${deleteSQL}
    DELETE
    FROM instruments.inst
    WHERE id IN (${ids});
  `);
};

const prepare = async (queryRunner: QueryRunner): Promise<void> => {
  await deleteInstruments(queryRunner, ['A1999', 'A199999']);

  await queryRunner.query(`
    DELETE
    FROM marketdata.stock_prices_daily
    WHERE feed = 'APEX'
      AND ts_date > '2021-09-01';

    UPDATE instruments.inst
    SET sedol            = NULL
      , type             = 'STOCK'
      , description      = 'LI AUTO INC'
      , shortdescription = 'LI AUTO INC'
    WHERE symbol = 'LI';

    UPDATE instruments.inst
    SET sedol            = NULL
      , type             = 'STOCK'
      , description      = 'PLUG POWER INC'
      , shortdescription = 'PLUG POWER INC'
    WHERE symbol = 'PLUG';

    DELETE
    FROM instruments.inst_feed
    WHERE feed = 'APEX'
      AND inst_id = ${instrumentsMap.PLUG};

    INSERT INTO instruments.inst_feed (inst_id, feed)
    VALUES (${instrumentsMap.LI}, 'MORNING_STAR')
         , (${instrumentsMap.PLUG}, 'MORNING_STAR')
    ON CONFLICT ON CONSTRAINT inst_feed_inst_id_feed_key
      DO NOTHING;
  `);
};

export const prepareData = async (): Promise<QueryRunner> => {
  const connection: Connection = await connect();
  const queryRunner = connection.createQueryRunner();
  await queryRunner.connect();
  await refreshInstrumentsMap(queryRunner, usedSymbols);
  await prepare(queryRunner);
  return queryRunner;
};
