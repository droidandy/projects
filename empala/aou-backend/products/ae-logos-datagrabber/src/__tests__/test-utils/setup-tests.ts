import { getConnection } from 'typeorm';
import { logger as testLogger } from '../../lib/logger';

export const KEEP_ROWS_NUMBER = 3;

const setupTestDB = async () => {
  const queryRunner = getConnection().createQueryRunner();
  const firstNIds = (await queryRunner.query(`
    SELECT id FROM instruments.inst LIMIT $1
  `, [KEEP_ROWS_NUMBER])).map((i: { id: BigInt }) => i.id);

  testLogger.debug('first n:', firstNIds);

  // before deleting the excess instruments we need to delete their relations
  const relations = [
    'instruments.inst_feed',
    'instruments.logos',
    'launchpad.theme_inst',
    'launchpad.inst_scalar_props',
    'launchpad.stack_inst',
    'launchpad.commstack_inst',
    'launchpad.hunch',
    'marketdata.stock_prices_daily',
  ];
  const idsToKeep = firstNIds.join();
  const deleteSQL = relations.reduce((prev, curr) =>
    prev + `DELETE FROM ${curr} WHERE inst_id  NOT IN (${idsToKeep});`, ''
  );

  await getConnection().query(deleteSQL);
  await queryRunner.query(`
    DELETE FROM instruments.inst WHERE id NOT IN (${idsToKeep})
  `);

  await queryRunner.query(`
    DELETE FROM instruments.logos
  `);

  await queryRunner.release();
};

export default setupTestDB;
