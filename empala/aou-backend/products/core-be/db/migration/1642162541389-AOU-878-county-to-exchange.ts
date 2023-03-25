import { MigrationInterface, QueryRunner } from 'typeorm';

export class AOU878CountyToExchange1642162541389 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`

      ALTER TABLE instruments.exchange
        ADD country varchar(3);

      UPDATE instruments.exchange
      SET country = 'USA';

      ALTER TABLE instruments.exchange
        ALTER COLUMN country SET NOT NULL;

      ALTER TABLE ONLY instruments.exchange
        ADD CONSTRAINT fkey_exchange_country FOREIGN KEY (country) REFERENCES instruments.country (name);

      ALTER TABLE instruments.inst
        DROP COLUMN country;

      CREATE FUNCTION instruments.inst_check_symbol_country_constraint() RETURNS trigger
        LANGUAGE plpgsql
      AS
      $$
      DECLARE
        e_id          bigint;
        e_symbol      text;
        e_exchange_id bigint;
        e_cusip       text;
        e_country     text;
      BEGIN
        -- "Happy pass" - the most common case
        IF NOT EXISTS(SELECT 1 FROM instruments.inst WHERE symbol = NEW.symbol) THEN
          RETURN NEW;
        END IF;

        IF (TG_OP = 'INSERT') THEN
          SELECT T1.id, T1.symbol, T1.exchange_id, T1.cusip, T1.country
          FROM (
                 SELECT I.id, I.symbol, I.exchange_id, I.cusip, E.country
                 FROM instruments.inst AS I
                        JOIN instruments.exchange AS E ON I.exchange_id = E.id
               ) AS T1
                 JOIN
               (
                 SELECT E1.country
                 FROM instruments.exchange AS E1
                 WHERE E1.id = NEW.exchange_id
               ) AS T2
               ON T1.symbol = NEW.symbol AND T1.country = T2.country
          LIMIT 1
          INTO e_id, e_symbol, e_exchange_id, e_cusip, e_country;

          IF e_id IS NOT NULL THEN
            RAISE EXCEPTION 'Can not insert symbol "%" with country "%" because the same already exists (id: %, exchange_id: %, cusip: %)',
              e_symbol, e_country, e_id::text, e_exchange_id::text, e_cusip;
          END IF;
        ELSIF (TG_OP = 'UPDATE') THEN
          SELECT T1.id, T1.symbol, T1.exchange_id, T1.cusip, T1.country
          FROM (
                 SELECT I.id, I.symbol, I.exchange_id, I.cusip, E.country
                 FROM instruments.inst AS I
                        JOIN instruments.exchange AS E ON I.exchange_id = E.id
               ) AS T1
                 JOIN
               (
                 SELECT E1.country
                 FROM instruments.exchange AS E1
                 WHERE E1.id = NEW.exchange_id
               ) AS T2
               ON T1.id != NEW.id AND T1.symbol = NEW.symbol AND T1.country = T2.country
          INTO e_id, e_symbol, e_exchange_id, e_cusip, e_country;

          IF e_id IS NOT NULL THEN
            RAISE EXCEPTION 'Can not update to symbol "%" with country "%" because the same already exists (id: %, exchange_id: %, cusip: %)',
              e_symbol, e_country, e_id::text, e_exchange_id::text, e_cusip;
          END IF;

        END IF;
        RETURN NEW;
      END;
      $$;

      CREATE TRIGGER inst_check_symbol_country_constraint
        BEFORE INSERT OR UPDATE
        ON instruments.inst
        FOR EACH ROW
      EXECUTE PROCEDURE instruments.inst_check_symbol_country_constraint();


      --====================================================================================================

      DROP FUNCTION IF EXISTS instruments.upsert_one_inst;
      CREATE OR REPLACE FUNCTION instruments.upsert_one_inst(
        u_country varchar,
        u_cusip varchar,
        u_descr varchar,
        u_exchange_name varchar,
        u_sedol varchar,
        u_short_descr varchar,
        u_symbol varchar,
        u_type instruments.e_inst_type,
        OUT inst_id bigint,
        OUT error_message varchar,
        OUT is_insert boolean
      )
        RETURNS record
        LANGUAGE plpgsql
      AS
      $fun$
      DECLARE
        u_ex_id          bigint;
        ex_id_tmp        bigint;
        country_tmp      varchar;
        symbol_tmp       varchar;
        exception_detail varchar;
      BEGIN
        --   RAISE NOTICE 'REC>>>>>>>>: country: %, cusip: %, descr: %, ex: %, sedol: %, short_descr: %, symbol: %, type: %',
        --     u_country, u_cusip, u_descr, u_exchange_name, u_sedol, u_short_descr, u_symbol, u_type;

        is_insert := FALSE;

        IF u_cusip IS NULL AND u_symbol IS NULL THEN
          error_message := 'Neither cusip nor symbol was passed';
          inst_id := 0;
          RETURN;
        END IF;

        IF u_exchange_name IS NOT NULL THEN
          u_ex_id := (SELECT id FROM instruments.exchange WHERE name = u_exchange_name);
          IF u_ex_id IS NULL THEN
            error_message := (SELECT FORMAT('Invalid exchange name was passed: %s', u_exchange_name));
            inst_id := 0;
            RETURN;
          END IF;
        END IF;

        IF u_country IS NOT NULL AND NOT EXISTS(SELECT name FROM instruments.country WHERE name = u_country) THEN
          error_message := (SELECT FORMAT('Invalid country was passed: %s', u_country));
          inst_id := 0;
          RETURN;
        END IF;

        IF u_cusip IS NOT NULL
        THEN
          SELECT I.id, E.country, I.exchange_id, I.symbol
          INTO inst_id, country_tmp, ex_id_tmp, symbol_tmp
          FROM instruments.inst AS I
                 JOIN instruments.exchange AS E ON I.exchange_id = E.id
          WHERE I.cusip = u_cusip;

          IF inst_id IS NOT NULL
          THEN -- The table have the passed cusip
          -- In case cusip is passed, symbol is not updated
            u_symbol := symbol_tmp;
            u_country := COALESCE(u_country, country_tmp);
            u_ex_id := COALESCE(u_ex_id, ex_id_tmp);

            IF EXISTS(
              SELECT 1
              FROM instruments.inst AS I
                     JOIN
                   instruments.exchange AS E ON I.exchange_id = E.id
              WHERE I.id != inst_id
                AND I.symbol = u_symbol
                AND E.country = u_country
              )
            THEN
              -- If uniqueness of symbol + country can be violated, country is not updated
              u_country := NULL;
            END IF;
            IF u_ex_id IS NOT NULL
              AND EXISTS(SELECT 1
                         FROM instruments.inst
                         WHERE id != inst_id
                           AND symbol = u_symbol
                           AND exchange_id = u_ex_id)
            THEN
              -- If the uniqueness of symbol + exchange_id can be violated, exchange_id is not updated
              u_ex_id := NULL;
            END IF;

            UPDATE instruments.inst
            SET description      = COALESCE(u_descr, description)
              , exchange_id      = COALESCE(u_ex_id, exchange_id)
              , sedol            = COALESCE(u_sedol, sedol)
              , shortdescription = COALESCE(u_short_descr, shortdescription)
              , symbol           = COALESCE(u_symbol, symbol)
              , type             = COALESCE(u_type, type)
            WHERE cusip = u_cusip;

          ELSE -- The table does not have the passed cusip yet
            IF u_symbol IS NULL THEN
              error_message := (SELECT FORMAT('No symbol passed for a new instrument. cusip = %s', u_cusip));
              inst_id := 0;
              RETURN;
            END IF;
            -- Check if there is already a record with the same symbol and country as passed
            inst_id := (
              SELECT I.id
              FROM instruments.inst AS I
                     JOIN instruments.exchange AS E ON I.exchange_id = E.id
              WHERE symbol = u_symbol
                AND E.country = u_country
            );
            IF inst_id IS NOT NULL
            THEN
              IF u_ex_id IS NOT NULL
                AND EXISTS(SELECT 1
                           FROM instruments.inst
                           WHERE id != inst_id
                             AND symbol = u_symbol
                             AND exchange_id = u_ex_id)
              THEN -- If the uniqueness of symbol + exchange_id can be violated, exchange_id is not updated
                u_ex_id := NULL;
              END IF;

              UPDATE instruments.inst
              SET description      = COALESCE(u_descr, description)
                , exchange_id      = COALESCE(u_ex_id, exchange_id)
                , sedol            = COALESCE(u_sedol, sedol)
                , shortdescription = COALESCE(u_short_descr, shortdescription)
                , type             = COALESCE(u_type, type)
              WHERE id = inst_id;

            ELSE -- The table does not have the passed cusip or symbol + country
              IF u_ex_id IS NOT NULL
                AND EXISTS(SELECT 1 FROM instruments.inst WHERE symbol = u_symbol AND exchange_id = u_ex_id)
              THEN
                -- If the uniqueness of symbol + exchange_id can be violated, update with this key
                UPDATE instruments.inst
                SET description      = COALESCE(u_descr, description)
                  , sedol            = COALESCE(u_sedol, sedol)
                  , shortdescription = COALESCE(u_short_descr, shortdescription)
                  , type             = COALESCE(u_type, type)
                WHERE symbol = u_symbol
                  AND exchange_id = u_ex_id;
              ELSE
                IF u_ex_id IS NULL THEN
                  error_message := (
                    SELECT FORMAT('No valid exchange name %s passed for a new instrument. symbol = %s, cusip = %s',
                                  COALESCE(u_exchange_name, 'NULL'), COALESCE(u_symbol, 'NULL'),
                                  COALESCE(u_cusip, 'NULL'))
                  );
                  inst_id := 0;
                  RETURN;
                END IF;
                IF u_country IS NULL THEN
                  error_message :=
                    (SELECT FORMAT('No country passed for a new instrument.  symbol = %s, cusip = %s', u_cusip,
                                   COALESCE(u_symbol, 'NULL'), COALESCE(u_cusip, 'NULL'))
                    );
                  inst_id := 0;
                  RETURN;
                END IF;

                BEGIN
                  -- If the transferred data does not conflict with any of the three unique constraints, insert the record
                  INSERT
                  INTO instruments.inst ( cusip, description, exchange_id, sedol, shortdescription, symbol
                                        , type)
                  VALUES (u_cusip, u_descr, u_ex_id, u_sedol, u_short_descr, u_symbol, u_type)
                  RETURNING id INTO inst_id;
                EXCEPTION
                  WHEN OTHERS THEN
                    GET STACKED DIAGNOSTICS error_message := MESSAGE_TEXT , exception_detail := PG_EXCEPTION_DETAIL;
                    error_message := error_message || '. ' || exception_detail;
                    inst_id := 0;
                    RETURN;
                END;

                IF inst_id IS NOT NULL THEN
                  is_insert := TRUE;
                END IF;
              END IF;
            END IF;
          END IF;
        ELSE -- u_cusip IS NULL (cusip isn't passed): upsert will performed by keys containing symbol
        -- Check if there is already a record with the same symbol and country as passed
          inst_id := (
            SELECT I.id
            FROM instruments.inst AS I
                   JOIN instruments.exchange AS E ON I.exchange_id = E.id
            WHERE symbol = u_symbol
              AND E.country = u_country
          );
          IF inst_id IS NOT NULL
          THEN -- We need to update the record with the key fields symbol and country
            IF EXISTS(SELECT 1
                      FROM instruments.inst
                      WHERE id != inst_id
                        AND symbol = u_symbol
                        AND exchange_id = u_ex_id)
            THEN
              -- If the uniqueness of symbol + exchange_id can be violated, exchange_id is not updated
              u_ex_id := NULL;
            END IF;

            UPDATE instruments.inst
            SET description      = COALESCE(u_descr, description)
              , exchange_id      = COALESCE(u_ex_id, exchange_id)
              , sedol            = COALESCE(u_sedol, sedol)
              , shortdescription = COALESCE(u_short_descr, shortdescription)
              , type             = COALESCE(u_type, type)
            WHERE id = inst_id;

          ELSE -- The table does not have the passed cusip or symbol + country
            IF u_ex_id IS NULL THEN
              error_message := (
                SELECT FORMAT('No valid exchange name %s passed for a new instrument. symbol = %s, cusip = %s',
                              COALESCE(u_exchange_name, 'NULL'), COALESCE(u_symbol, 'NULL'), COALESCE(u_cusip, 'NULL'))
              );
              inst_id := 0;
              RETURN;
            END IF;

            IF EXISTS(SELECT 1 FROM instruments.inst WHERE symbol = u_symbol AND exchange_id = u_ex_id)
            THEN -- We need to update the record with the key fields symbol and exchange_id
              UPDATE instruments.inst
              SET description      = COALESCE(u_descr, description)
                , sedol            = COALESCE(u_sedol, sedol)
                , shortdescription = COALESCE(u_short_descr, shortdescription)
                , type             = COALESCE(u_type, type)
              WHERE symbol = u_symbol
                AND exchange_id = u_ex_id;
            ELSE
              BEGIN
                -- If the transferred data does not conflict with any of the three unique constraints, insert the record
                INSERT
                INTO instruments.inst (cusip, description, exchange_id, sedol, shortdescription, symbol, type)
                VALUES (u_cusip, u_descr, u_ex_id, u_sedol, u_short_descr, u_symbol, u_type)
                RETURNING id INTO inst_id;
              EXCEPTION
                WHEN OTHERS THEN
                  GET STACKED DIAGNOSTICS error_message := MESSAGE_TEXT , exception_detail := PG_EXCEPTION_DETAIL;
                  error_message := error_message || '. ' || exception_detail;
                  inst_id := 0;
                  RETURN;
              END;
              IF inst_id IS NOT NULL THEN
                is_insert := TRUE;
              END IF;
            END IF;
          END IF;
        END IF; -- IF u_cusip IS NOT NULL
      END;
        -- --== USAGE EXAMPLE ==--
        -- DO
        -- $$
        --   DECLARE
        --     error_message varchar;
        --     inst_id       bigint;
        --   BEGIN
        --     SELECT *
        --     FROM instruments.upsert_one_inst(
        --         'USA',null,'Agilent Technologies Inc','NMS',null,'Agilent Technologies','A','STOCK'::instruments.e_inst_type
        --       )
        --     INTO inst_id, error_message;
        --     IF COALESCE(inst_id, 0) > 0 THEN
        --       RAISE NOTICE 'Upserted inst_id: %', inst_id;
        --     ELSE
        --       RAISE EXCEPTION 'An error has occurred %', COALESCE(error_message, 'Unknown error!!!');
        --     END IF;
        --   END
        -- $$;
        -- SELECT *
        -- FROM instruments.inst;
      $fun$;

      --====================================================================================================

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
                                  JOIN instruments.exchange AS E ON T.exchange_id = E.id
                           WHERE T.symbol = ct.new_symbol
                             AND ((T.exchange_id = ct.exchange_id) OR (E.country = ct.country)));
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
    await queryRunner.query(`
    /*
      ALTER TABLE instruments.exchange
        ALTER COLUMN country DROP NOT NULL;

      DROP TRIGGER inst_check_symbol_country_constraint ON instruments.inst;
      DROP FUNCTION instruments.inst_check_symbol_country_constraint();

      ALTER TABLE instruments.exchange
        DROP COLUMN country;

      ALTER TABLE instruments.inst
        ADD country text;

      UPDATE instruments.inst
      SET country = 'USA';

      ALTER TABLE instruments.inst
        ALTER COLUMN country SET NOT NULL;

      ALTER TABLE ONLY instruments.inst
        ADD CONSTRAINT fkey_inst_symbol_country FOREIGN KEY (country) REFERENCES instruments.country (name);

      ALTER TABLE instruments.inst
        ADD CONSTRAINT key_inst_symbol_country
          UNIQUE (symbol, country);

  */
  `);
  }
}
