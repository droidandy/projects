/* eslint-disable @typescript-eslint/no-unused-vars */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AOU876MSDatagrabberFix1640698233878 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP FUNCTION IF EXISTS instruments.upsert_instruments_and_update_symbols;

      CREATE OR REPLACE FUNCTION instruments.upsert_instruments_and_update_symbols(
        instruments_array varchar[],
        instruments_name_change_array varchar[],
        u_feed varchar
      )
        RETURNS TABLE
                (
                  index_of_input_array integer,
                  inst_id              bigint,
                  error_message        varchar,
                  country              varchar,
                  cusip                varchar,
                  exchange_name        varchar,
                  symbol               varchar,
                  is_inserted          boolean
                )
      AS
      $BODY$
        -- =============== FUNCTION INPUT PARAMETERS   ===============:
        -- instruments_array varchar[]:
        -- 2D-Array of instruments that we want to upsert.
        -- Structure: [ [country, cusip, description, exchange_name, sedol, shortdescription, symbol, type], ... ]

        -- instruments_name_change_array varchar[]:
        -- 2D-Array of instruments name (symbol field) changes.
        -- Structure: [ [old_symbol, new_symbol, exchange_name, country], ...]

        -- u_feed varchar:
        -- The feed for which the tools are upserted

        -- =============== NOTES ON SOME RETURN PARAMETERS   ===============:
        -- index_of_input_array integer : 0-based index of instrument in the input instruments array
        -- inst_id              bigint  : ID of the instrument that was upserted. 0 - if the instrument is not upserted.
        -- error_message        varchar : Reason (error) message for which the instrument could not be upserted.
        -- is_inserted          boolean : Flag that the record has been INSERTED to the database (otherwise - UPDATED)

      DECLARE
        u_country          varchar;
        u_cusip            varchar;
        u_descr            varchar;
        u_exchange_name    varchar;
        u_sedol            varchar;
        u_short_descr      varchar;
        u_symbol           varchar;
        u_type             varchar;
        array_row_number   integer;
        instruments_cursor refcursor;
        error_message      varchar;
        inst_id            bigint;
        is_insert          boolean;
      BEGIN
        -- If names change map is passed, then we update the symbol names in the table
        IF u_feed IS NULL OR NOT EXISTS(SELECT 1 FROM instruments.feed F WHERE F.name = u_feed) THEN
          RAISE EXCEPTION 'No valid feed passed: %s', u_feed;
        END IF;

        IF instruments_name_change_array IS NOT NULL AND ARRAY_LENGTH(instruments_name_change_array, 1) > 0
        THEN
          WITH name_changes_cte (old_symbol, new_symbol, exchange_id, country) AS
                 (
                   SELECT old_symbol, new_symbol, ex.id AS exchange_id, rt.country
                   FROM (SELECT (instruments_name_change_array)[s][1]::varchar AS "old_symbol"
                              , (instruments_name_change_array)[s][2]::varchar AS "new_symbol"
                              , (instruments_name_change_array)[s][3]::varchar AS "exchange_name"
                              , (instruments_name_change_array)[s][4]::varchar AS "country"
                         FROM GENERATE_SERIES(1, ARRAY_UPPER(instruments_name_change_array, 1)) AS s) rt
                          JOIN instruments.exchange AS ex ON ex.name = rt.exchange_name
                 )

          UPDATE instruments.inst AS U
          SET symbol = ct.new_symbol
          FROM name_changes_cte AS ct
          WHERE U.exchange_id = ct.exchange_id
            AND U.symbol = ct.old_symbol
            -- A condition that prevents the name of a symbol from being updated
            -- if a new name already exists with the same exchange_id
            AND NOT EXISTS(SELECT 1
                           FROM instruments.inst T
                           WHERE T.symbol = ct.new_symbol
                             AND ((T.exchange_id = ct.exchange_id) OR (T.country = ct.country)));
        END IF;

        OPEN instruments_cursor FOR SELECT i::integer                         AS "array_row_number"
                                         , (instruments_array)[i][1]::varchar AS "u_country"
                                         , (instruments_array)[i][2]::varchar AS "u_cusip"
                                         , (instruments_array)[i][3]::varchar AS "u_description"
                                         , (instruments_array)[i][4]::varchar AS "u_exchange_name"
                                         , (instruments_array)[i][5]::varchar AS "u_sedol"
                                         , (instruments_array)[i][6]::varchar AS "u_short_descr"
                                         , (instruments_array)[i][7]::varchar AS "u_symbol"
                                         , (instruments_array)[i][8]::varchar AS "u_type"
                                    FROM GENERATE_SERIES(1, ARRAY_UPPER(instruments_array, 1)) AS i;
        LOOP
          FETCH FROM instruments_cursor INTO
              array_row_number,
              u_country,
              u_cusip,
              u_descr,
              u_exchange_name,
              u_sedol,
              u_short_descr,
              u_symbol,
              u_type;

          EXIT WHEN NOT FOUND;

          SELECT *
          FROM instruments.upsert_one_inst(
            u_country::varchar,
            u_cusip::varchar,
            u_descr::varchar,
            u_exchange_name::varchar,
            u_sedol::varchar,
            u_short_descr::varchar,
            u_symbol::varchar,
            u_type::instruments.e_inst_type
            )
          INTO inst_id, error_message, is_insert;
          --     IF COALESCE(inst_id, 0) > 0 THEN
          --       RAISE NOTICE 'inst_id: %', inst_id;
          --     ELSE
          --       RAISE EXCEPTION '%', COALESCE(error_message, 'NO ERROR MESSAGE');
          --     END IF;
          instruments_array[array_row_number][3] = array_row_number - 1; -- line number -> 0-based index
          instruments_array[array_row_number][5] = inst_id::bigint;
          instruments_array[array_row_number][6] = error_message;
          instruments_array[array_row_number][8] = is_insert::boolean;
          -- RAISE NOTICE 'instruments_array : %', instruments_array;
        END LOOP;

        INSERT
        INTO instruments.inst_feed (inst_id, feed)
        SELECT T.id, u_feed
        FROM (
               SELECT (instruments_array)[i][5]::bigint AS id
               FROM GENERATE_SERIES(1, ARRAY_UPPER(instruments_array, 1)) AS i
             ) AS T
               JOIN instruments.inst AS I ON I.id = T.id
        WHERE COALESCE(T.id, 0) > 0
        ON CONFLICT DO NOTHING;

        RETURN QUERY SELECT (instruments_array)[i][3]::integer AS "index_of_input_array"
                          , (instruments_array)[i][5]::bigint  AS "inst_id"
                          , (instruments_array)[i][6]::varchar AS "error_message"
                          , (instruments_array)[i][1]::varchar AS "country"
                          , (instruments_array)[i][2]::varchar AS "cusip"
                          , (instruments_array)[i][4]::varchar AS "exchange_name"
                          , (instruments_array)[i][7]::varchar AS "symbol"
                          , (instruments_array)[i][8]::boolean AS "is_inserted"
                     FROM GENERATE_SERIES(1, ARRAY_UPPER(instruments_array, 1)) AS i;

      END;
        -- --== USAGE EXAMPLE ==--
        -- DO
        -- $$
        -- DECLARE
        --   ren varchar[] := ARRAY [
        --     ['GTE!NEW1','GTE','NMS'],
        --   ['GOOG','GOOGL','NMS'],
        --   ['GNTY!NEW1','GNTY','NMS'],
        --   ['QVCA','QRTEA','NMS'],
        --   ['IPXL','AMRX','NMS'],
        --   ['LUK','JEF','NMS'],
        --   ['HBHC','HWC','NMS'],
        --   ['HBHCL','HWCPL','NMS'],
        --   ['OAKSpA','HCFTpA','NMS'],
        --   ['CPLGw','CPLG','NMS']
        --     ];
        --
        --   new_instruments varchar[] := ARRAY [
        --   ['USA',null,'Agilent Technologies Inc','NMS',null,'Agilent Technologies','A','STOCK'],
        --   ['USA',null,'Alcoa Corp','NMS',null,'Alcoa Corp','AA','STOCK'],
        --   ['USA',null,null,'NMS',null,'AAF First Priority CLO','AAA','ETF'],
        --   ['USA',null,null,'NMS',null,'Goldman Sachs Physical Gold ETF Shares','AAAU','ETF'],
        --   ['USA',null,'Ares Acquisition Corp','NMS',null,'Ares Acquisition Corp','AAC','STOCK'],
        --   ['USA',null,'Armada Acquisition Corp I','NMS',null,'Armada Acquisition Corp','AACI','STOCK'],
        --   ['USA',null,'Aadi Bioscience Inc','NMS',null,'Aadi Bioscience','AADI','STOCK'],
        --   ['USA',null,null,'NMS',null,'AdvisorShares Dorsey Wright ADR ETF','AADR','ETF'],
        --   ['USA',null,'Arlington Asset Investment Corp','NMS',null,'Arlington Asset Investment Corp','AAIC','STOCK'],
        --   ['USA',null,'American Airlines Group Inc','NMS',null,'American Airlines Group','AAL','STOCK']
        --   ];
        -- BEGIN
        --   DROP TABLE IF EXISTS _X;
        --   CREATE TEMPORARY TABLE _X
        --   AS
        --    SELECT * FROM instruments.upsert_instruments_and_update_symbols(new_instruments,ren, 'APEX');
        -- END
        -- $$;
        -- SELECT * FROM _X;
        --
        --
        -- SELECT *
        -- FROM instruments.inst;
      $BODY$ LANGUAGE plpgsql;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    //
  }
}
