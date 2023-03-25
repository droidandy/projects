/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class tablesAndLogging1637200143823 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP SCHEMA IF EXISTS logs CASCADE;

      CREATE SCHEMA logs;

      CREATE FUNCTION logs.log() RETURNS trigger
      LANGUAGE plpgsql
      AS $$
      BEGIN
          IF TG_OP NOT IN ('INSERT', 'UPDATE', 'DELETE') THEN
              RAISE EXCEPTION 'This function should not fire on %', TG_OP;
          END IF;

          IF TG_OP = 'INSERT' THEN
              INSERT INTO logs.the_log (
                  action, table_schema,    table_name, new_row
              )
              SELECT
                  TG_OP,  TG_TABLE_SCHEMA, TG_RELNAME, row_to_json(new_table)::jsonb
              FROM
                  new_table;

          ELSIF TG_OP = 'DELETE' THEN
            INSERT INTO logs.the_log (
              action, table_schema,    table_name, old_row
            )
            SELECT
              TG_OP,  TG_TABLE_SCHEMA, TG_RELNAME, row_to_json(old_table)::jsonb
            FROM
              old_table;

       ELSE
              /*
               *  DANGER, WILL ROBINSON!  DANGER!
               *  This implementation assumes based on current implementation details
               *  that old_table and new_table have identical orderings.  Should that
               *  implementation detail change, this could get a lot more complicated.
               */

              WITH
                  o AS (
                      SELECT
                          row_to_json(old_table)::jsonb AS old_row,
                          row_number() OVER () AS ord
                       FROM old_table
                  ),
                  n AS (
                  SELECT
                      row_to_json(new_table)::jsonb AS new_row,
                      row_number() OVER () AS ord
                  FROM new_table
              )
              INSERT INTO logs.the_log (
                  action, table_schema,    table_name, old_row, new_row
              )
              SELECT
                  TG_OP,  TG_TABLE_SCHEMA, TG_RELNAME, old_row, new_row
              FROM
                  o
              JOIN
                  n
                  USING(ord);
          END IF;
          RETURN NULL;
      END;
      $$;

      CREATE TABLE IF NOT EXISTS logs.the_log (
          "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
          "user" text NOT NULL DEFAULT CURRENT_USER,
          action text NOT NULL,
          table_schema text NOT NULL,
          table_name text NOT NULL,
          old_row jsonb,
          new_row jsonb,
          CONSTRAINT the_log_check CHECK (
              (old_row IS NOT NULL)::integer +
              (new_row IS NOT NULL)::integer > 0
          )
      ) PARTITION BY LIST(table_schema);

      CREATE OR REPLACE FUNCTION logs.add_logger(schema_name text, table_name text) RETURNS void
      LANGUAGE plpgsql
      AS $_$
        DECLARE
          cmd  TEXT;
        BEGIN
          RAISE NOTICE 'Adding log table(s) for %.%', schema_name, table_name;
          cmd := format('CREATE TABLE IF NOT EXISTS logs.%I
            PARTITION OF logs.the_log
            FOR VALUES IN (%L)
              PARTITION BY LIST(table_name);',
              pg_catalog.concat_ws('_', schema_name, 'log'),
              schema_name
          );
          EXECUTE cmd;
          cmd := format('CREATE TABLE IF NOT EXISTS logs.%I
            PARTITION OF logs.%s
            FOR VALUES IN (%L);',
              pg_catalog.concat_ws('_', schema_name, table_name, 'log'),
              pg_catalog.concat_ws('_', schema_name, 'log'),
              table_name
          );
          EXECUTE cmd;

          cmd := format(
            $q$CREATE TRIGGER %I
            AFTER INSERT ON %I.%I
            REFERENCING NEW TABLE AS new_table
            FOR EACH STATEMENT
              EXECUTE PROCEDURE logs.log();$q$,
              pg_catalog.concat_ws('_', 'log_insert', schema_name, table_name),
              schema_name,
              table_name
          );
          EXECUTE cmd;
          cmd := format(
            $q$CREATE TRIGGER %I
            AFTER UPDATE ON %I.%I
            REFERENCING OLD TABLE AS old_table NEW TABLE AS new_table
            FOR EACH STATEMENT
              EXECUTE PROCEDURE logs.log();$q$,
              pg_catalog.concat_ws('_', 'log_update', schema_name, table_name),
              schema_name,
              table_name
          );
          EXECUTE cmd;
          cmd := format(
            $q$CREATE TRIGGER %I
            AFTER DELETE ON %I.%I
            REFERENCING OLD TABLE AS old_table
            FOR EACH STATEMENT
              EXECUTE PROCEDURE logs.log();$q$,
              pg_catalog.concat_ws('_', 'log_delete', schema_name, table_name),
              schema_name,
              table_name
          );
          EXECUTE cmd;
          EXCEPTION
            WHEN no_data_found THEN
              NULL;
        END;
      $_$;



      -- INSTRUMENTS SCHEMA AND TABLE --

      DROP SCHEMA IF EXISTS instruments CASCADE;
      CREATE SCHEMA instruments;

      CREATE TYPE instruments.e_inst_type AS ENUM (
        'STOCK',
        'ETF'
      );

      CREATE TABLE instruments.exchange (
        id BIGINT GENERATED ALWAYS AS IDENTITY,
        name character varying NOT NULL
      );
      SELECT logs.add_logger('instruments', 'exchange');

      CREATE TABLE instruments.inst (
        id BIGINT GENERATED ALWAYS AS IDENTITY,
        symbol character varying NOT NULL,
        cusip character varying,
        sedol character varying NULL,
        exchange_id bigint NOT NULL,
        type instruments.e_inst_type NOT NULL,
        description character varying,
        shortdescription varchar,
        country TEXT
      );
      SELECT logs.add_logger('instruments', 'inst');

      ALTER TABLE ONLY instruments.exchange
        ADD CONSTRAINT pkey_exchange_id PRIMARY KEY (id);

      ALTER TABLE ONLY instruments.inst
        ADD CONSTRAINT pkey_inst_id PRIMARY KEY (id);

      ALTER TABLE instruments.inst
        ADD CONSTRAINT key_inst_cusip UNIQUE (cusip);

      CREATE INDEX fki_fkey_inst_exchange_id ON instruments.inst USING btree (exchange_id);

      ALTER TABLE ONLY instruments.inst
        ADD CONSTRAINT fkey_exchange_id FOREIGN KEY (exchange_id) REFERENCES instruments.exchange(id);

      -- drop table if exists instruments.feed cascade;
      -- drop table if exists instruments.inst_feed cascade;

      CREATE TABLE instruments.feed (name TEXT not null);
      SELECT logs.add_logger('instruments', 'feed');

      ALTER TABLE ONLY instruments.feed
      ADD CONSTRAINT pkey_feed_name PRIMARY KEY (name);

      INSERT INTO instruments.feed (name) VALUES ('APEX'), ('MORNING_STAR');

      CREATE TABLE instruments.inst_feed(
        id BIGINT GENERATED ALWAYS AS IDENTITY,
        inst_id bigint not null,
        feed TEXT not null,
        UNIQUE (inst_id, feed)
      );
      SELECT logs.add_logger('instruments', 'inst_feed');

      ALTER TABLE ONLY instruments.inst_feed ADD CONSTRAINT pkey_inst_feed_id PRIMARY KEY (id);
      ALTER TABLE ONLY instruments.inst_feed ADD CONSTRAINT fkey_inst_feed_inst_id FOREIGN KEY (inst_id) REFERENCES instruments.inst(id);
      ALTER TABLE ONLY instruments.inst_feed ADD CONSTRAINT fkey_inst_feed_feed FOREIGN KEY (feed) REFERENCES instruments.feed;

      CREATE INDEX fki_fkey_inst_feed_inst_id ON instruments.inst_feed USING btree (inst_id);

      -- countries
      -- Temporarily remove the cusip constraint
      ALTER TABLE instruments.inst DROP CONSTRAINT key_inst_cusip;

      CREATE TABLE instruments.country
      (
        name TEXT NOT NULL
      );

      ALTER TABLE ONLY instruments.country
        ADD CONSTRAINT pkey_country_name PRIMARY KEY (name);

      INSERT INTO instruments.country (name)
      VALUES ('AFG'),
             ('ALA'),
             ('ALB'),
             ('DZA'),
             ('ASM'),
             ('AND'),
             ('AGO'),
             ('AIA'),
             ('ATA'),
             ('ATG'),
             ('ARG'),
             ('ARM'),
             ('ABW'),
             ('AUS'),
             ('AUT'),
             ('AZE'),
             ('BHS'),
             ('BHR'),
             ('BGD'),
             ('BRB'),
             ('BLR'),
             ('BEL'),
             ('BLZ'),
             ('BEN'),
             ('BMU'),
             ('BTN'),
             ('BOL'),
             ('BES'),
             ('BIH'),
             ('BWA'),
             ('BVT'),
             ('BRA'),
             ('IOT'),
             ('BRN'),
             ('BGR'),
             ('BFA'),
             ('BDI'),
             ('CPV'),
             ('KHM'),
             ('CMR'),
             ('CAN'),
             ('CYM'),
             ('CAF'),
             ('TCD'),
             ('CHL'),
             ('CHN'),
             ('CXR'),
             ('CCK'),
             ('COL'),
             ('COM'),
             ('COG'),
             ('COD'),
             ('COK'),
             ('CRI'),
             ('CIV'),
             ('HRV'),
             ('CUB'),
             ('CUW'),
             ('CYP'),
             ('CZE'),
             ('DNK'),
             ('DJI'),
             ('DMA'),
             ('DOM'),
             ('ECU'),
             ('EGY'),
             ('SLV'),
             ('GNQ'),
             ('ERI'),
             ('EST'),
             ('ETH'),
             ('FLK'),
             ('FRO'),
             ('FJI'),
             ('FIN'),
             ('FRA'),
             ('GUF'),
             ('PYF'),
             ('ATF'),
             ('GAB'),
             ('GMB'),
             ('GEO'),
             ('DEU'),
             ('GHA'),
             ('GIB'),
             ('GRC'),
             ('GRL'),
             ('GRD'),
             ('GLP'),
             ('GUM'),
             ('GTM'),
             ('GGY'),
             ('GIN'),
             ('GNB'),
             ('GUY'),
             ('HTI'),
             ('HMD'),
             ('VAT'),
             ('HND'),
             ('HKG'),
             ('HUN'),
             ('ISL'),
             ('IND'),
             ('IDN'),
             ('IRN'),
             ('IRQ'),
             ('IRL'),
             ('IMN'),
             ('ISR'),
             ('ITA'),
             ('JAM'),
             ('JPN'),
             ('JEY'),
             ('JOR'),
             ('KAZ'),
             ('KEN'),
             ('KIR'),
             ('PRK'),
             ('KOR'),
             ('KWT'),
             ('KGZ'),
             ('LAO'),
             ('LVA'),
             ('LBN'),
             ('LSO'),
             ('LBR'),
             ('LBY'),
             ('LIE'),
             ('LTU'),
             ('LUX'),
             ('MAC'),
             ('MKD'),
             ('MDG'),
             ('MWI'),
             ('MYS'),
             ('MDV'),
             ('MLI'),
             ('MLT'),
             ('MHL'),
             ('MTQ'),
             ('MRT'),
             ('MUS'),
             ('MYT'),
             ('MEX'),
             ('FSM'),
             ('MDA'),
             ('MCO'),
             ('MNG'),
             ('MNE'),
             ('MSR'),
             ('MAR'),
             ('MOZ'),
             ('MMR'),
             ('NAM'),
             ('NRU'),
             ('NPL'),
             ('NLD'),
             ('NCL'),
             ('NZL'),
             ('NIC'),
             ('NER'),
             ('NGA'),
             ('NIU'),
             ('NFK'),
             ('MNP'),
             ('NOR'),
             ('OMN'),
             ('PAK'),
             ('PLW'),
             ('PSE'),
             ('PAN'),
             ('PNG'),
             ('PRY'),
             ('PER'),
             ('PHL'),
             ('PCN'),
             ('POL'),
             ('PRT'),
             ('PRI'),
             ('QAT'),
             ('REU'),
             ('ROU'),
             ('RUS'),
             ('RWA'),
             ('BLM'),
             ('SHN'),
             ('KNA'),
             ('LCA'),
             ('MAF'),
             ('SPM'),
             ('VCT'),
             ('WSM'),
             ('SMR'),
             ('STP'),
             ('SAU'),
             ('SEN'),
             ('SRB'),
             ('SYC'),
             ('SLE'),
             ('SGP'),
             ('SXM'),
             ('SVK'),
             ('SVN'),
             ('SLB'),
             ('SOM'),
             ('ZAF'),
             ('SGS'),
             ('SSD'),
             ('ESP'),
             ('LKA'),
             ('SDN'),
             ('SUR'),
             ('SJM'),
             ('SWZ'),
             ('SWE'),
             ('CHE'),
             ('SYR'),
             ('TWN'),
             ('TJK'),
             ('TZA'),
             ('THA'),
             ('TLS'),
             ('TGO'),
             ('TKL'),
             ('TON'),
             ('TTO'),
             ('TUN'),
             ('TUR'),
             ('TKM'),
             ('TCA'),
             ('TUV'),
             ('UGA'),
             ('UKR'),
             ('ARE'),
             ('GBR'),
             ('USA'),
             ('UMI'),
             ('URY'),
             ('UZB'),
             ('VUT'),
             ('VEN'),
             ('VNM'),
             ('VGB'),
             ('VIR'),
             ('WLF'),
             ('ESH'),
             ('YEM'),
             ('ZMB'),
             ('ZWE');

      -- LAUNCHPAD --

      DROP SCHEMA IF EXISTS launchpad CASCADE;

      CREATE SCHEMA launchpad;

      CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;

      CREATE DOMAIN launchpad.email_type AS public.citext
        CONSTRAINT email_type_check
        CHECK ((VALUE OPERATOR(public.~) '^[a-zA-Z0-9.!#$%&''*+/=?^_\`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$'::public.citext));

      SET default_tablespace = '';
      SET default_table_access_method = heap;

      CREATE TABLE launchpad.stack (
        id BIGINT GENERATED ALWAYS AS IDENTITY,
        user_id bigint NOT NULL,
        name varchar(120) NOT NULL
      );
      SELECT logs.add_logger('launchpad', 'stack');

      CREATE TABLE launchpad.stack_inst (
        id bigint GENERATED ALWAYS AS IDENTITY,
        stack_id bigint NOT NULL,
        inst_id bigint NOT NULL
      );
      SELECT logs.add_logger('launchpad', 'stack_inst');

      CREATE TABLE launchpad.commstack (
        id BIGINT GENERATED ALWAYS AS IDENTITY,
        name character varying(255) NOT NULL
      );
      SELECT logs.add_logger('launchpad', 'commstack');

      CREATE TABLE launchpad.commstack_inst (
        id bigint GENERATED ALWAYS AS IDENTITY,
        commstack_id bigint NOT NULL,
        inst_id bigint NOT NULL
      );
      SELECT logs.add_logger('launchpad', 'commstack_inst');

      CREATE TABLE launchpad.theme (
        id bigint GENERATED ALWAYS AS IDENTITY,
        name character varying(255) NOT NULL
      );
      SELECT logs.add_logger('launchpad', 'theme');

      CREATE TABLE launchpad.theme_inst (
        id bigint GENERATED ALWAYS AS IDENTITY,
        theme_id bigint NOT NULL,
        inst_id bigint NOT NULL
      );
      SELECT logs.add_logger('launchpad', 'theme_inst');

      CREATE TABLE launchpad.tag (
        id bigint GENERATED ALWAYS AS IDENTITY,
        theme_id bigint NOT NULL,
        inst_id bigint NOT NULL,
        user_id bigint NOT NULL
      );
      SELECT logs.add_logger('launchpad', 'tag');

      CREATE TABLE launchpad."user" (
        id bigint GENERATED ALWAYS AS IDENTITY,
        user_cognito_id varchar(512) NOT NULL,
        email launchpad.email_type check(length(email) <= 64) NOT NULL,
        phone varchar(30),
        full_name character varying NOT NULL,
        user_name character varying NOT NULL,
        bio character varying(2048),
        avatar character varying(65536)
      );
      SELECT logs.add_logger('launchpad', 'user');

      CREATE TABLE launchpad.userfollow (
        id bigint GENERATED ALWAYS AS IDENTITY,
        user_follower_id bigint NOT NULL,
        user_followed_id bigint NOT NULL
      );
      SELECT logs.add_logger('launchpad', 'userfollow');

      CREATE TABLE launchpad.hunch (
        id bigint GENERATED ALWAYS AS IDENTITY,
        user_id bigint NOT NULL,
        inst_id bigint NOT NULL,
        target_price NUMERIC(8,2) NOT NULL,
        by_date date NOT NULL,
        description varchar(120)
      );
      SELECT logs.add_logger('launchpad', 'hunch');

      CREATE TABLE launchpad.stackfollow (
        id bigint GENERATED ALWAYS AS IDENTITY,
        user_follower_id bigint NOT NULL,
        stack_followed_id bigint NOT NULL
      );
      SELECT logs.add_logger('launchpad', 'stackfollow');

      CREATE TABLE launchpad.hunchfollow (
        id bigint GENERATED ALWAYS AS IDENTITY,
        user_follower_id bigint NOT NULL,
        hunch_followed_id bigint NOT NULL
      );
      SELECT logs.add_logger('launchpad', 'hunchfollow');

      CREATE TABLE launchpad.inst_scalar_props(
        id BIGINT GENERATED ALWAYS AS IDENTITY,
        inst_id bigint not null,
        is_traded bool not null,
        UNIQUE (inst_id)
      );
      SELECT logs.add_logger('launchpad', 'inst_scalar_props');


      CREATE SCHEMA IF NOT EXISTS launchpad_ae_onboarding;

      CREATE TYPE launchpad_ae_onboarding.e_account_type AS ENUM ( 'CASH', 'MARGIN' );

      CREATE TABLE launchpad_ae_onboarding.application (
        id BIGINT GENERATED ALWAYS AS IDENTITY,
        apex_application_id BIGINT NOT NULL,
        status TEXT,
        validation_errors JSONB DEFAULT NULL,
        user_id  BIGINT NOT NULL,
        trade_account_id TEXT,
        account_type launchpad_ae_onboarding.e_account_type NOT NULL DEFAULT 'CASH'
      );

      SELECT logs.add_logger('launchpad_ae_onboarding', 'application');


      --========================PRIMARY KEY CONSTRAINTS====================---

      ALTER TABLE ONLY launchpad.stack
          ADD CONSTRAINT pkey_stack_id PRIMARY KEY (id);

      ALTER TABLE ONLY launchpad.stack_inst
          ADD CONSTRAINT pkey_stack_inst_id PRIMARY KEY (id);

      ALTER TABLE ONLY launchpad.commstack
          ADD CONSTRAINT pkey_commstack_id PRIMARY KEY (id);

      ALTER TABLE ONLY launchpad.commstack_inst
          ADD CONSTRAINT pkey_commstack_inst_id PRIMARY KEY (id);

      ALTER TABLE ONLY launchpad.theme
          ADD CONSTRAINT pkey_theme_id PRIMARY KEY (id);

      ALTER TABLE ONLY launchpad.tag
          ADD CONSTRAINT pkey_tag_id PRIMARY KEY (id);

      ALTER TABLE ONLY launchpad."user"
          ADD CONSTRAINT pkey_user_id PRIMARY KEY (id);

      ALTER TABLE ONLY launchpad.hunch
          ADD CONSTRAINT pkey_hunch_id PRIMARY KEY (id);

      ALTER TABLE ONLY launchpad.hunch
          ADD CONSTRAINT launchpad_hunch_description_length CHECK (length(description) > 0);

      ALTER TABLE ONLY launchpad.hunch
        ADD CONSTRAINT launchpad_unique_hunch_per_user_by_date UNIQUE (user_id, inst_id, by_date);

      ALTER TABLE ONLY launchpad.hunch
        ADD CONSTRAINT target_price_bigger_than_zero CHECK (target_price > 0);

      ALTER TABLE ONLY launchpad.hunchfollow
          ADD CONSTRAINT pkey_hunchfollow_id PRIMARY KEY (id);

      ALTER TABLE ONLY launchpad.stackfollow
          ADD CONSTRAINT pkey_stackfollow_id PRIMARY KEY (id);

      ALTER TABLE ONLY launchpad.inst_scalar_props ADD CONSTRAINT pkey_inst_scalar_props_id PRIMARY KEY (id);
      ALTER TABLE ONLY launchpad.inst_scalar_props ADD CONSTRAINT fkey_inst_scalar_props_inst_id FOREIGN KEY (inst_id) REFERENCES instruments.inst(id);

      ALTER TABLE ONLY launchpad_ae_onboarding.application
        ADD CONSTRAINT pkey_application_id PRIMARY KEY (id);

      ALTER TABLE launchpad_ae_onboarding.application
        ADD CONSTRAINT key_application_trade_account_id UNIQUE (trade_account_id);

      CREATE INDEX fki_fkey_application_user_id ON launchpad_ae_onboarding.application USING btree (user_id);
      ALTER TABLE ONLY launchpad_ae_onboarding.application
        ADD CONSTRAINT fkey_application_user_id FOREIGN KEY (user_id) REFERENCES launchpad."user" (id);

      --============== FOREIGN KEY INDICES===============--
      --THEME_INST
      CREATE INDEX fki_fkey_theme_inst_inst_id ON launchpad.theme_inst USING btree (inst_id);
      CREATE INDEX fki_fkey_theme_inst_theme_id ON launchpad.theme_inst USING btree (theme_id);

      --STACK
      CREATE INDEX fki_fkey_stack_user_id ON launchpad.stack USING btree (user_id);

      --STACK_INST
      CREATE INDEX fki_fkey_stack_inst_inst_id ON launchpad.stack_inst USING btree (inst_id);
      CREATE INDEX fki_fkey_stack_inst_stack_id ON launchpad.stack_inst USING btree (stack_id);

      --COMMSTACK_INST
      CREATE INDEX fki_fkey_commstack_inst_inst_id ON launchpad.commstack_inst USING btree (inst_id);
      CREATE INDEX fki_fkey_commstack_inst_commstack_id ON launchpad.commstack_inst USING btree (commstack_id);

      --TAG
      CREATE INDEX fki_fkey_tag_user_id ON launchpad.tag USING btree (user_id);
      CREATE INDEX fki_fkey_tag_theme_id ON launchpad.tag USING btree (theme_id);
      CREATE INDEX fki_fkey_tag_inst_id ON launchpad.tag USING btree (inst_id);

      --USERFOLLOW
      CREATE INDEX fki_fkey_userfollow_followed_id ON launchpad.userfollow USING btree (user_followed_id);
      CREATE INDEX fki_fkey_userfollow_follower_id ON launchpad.userfollow USING btree (user_follower_id);

      --HUNCHFOLLOW
      CREATE INDEX fki_fkey_hunchfollow_followed_id ON launchpad.hunchfollow USING btree (hunch_followed_id);
      CREATE INDEX fki_fkey_hunchfollow_follower_id ON launchpad.hunchfollow USING btree (user_follower_id);

      --STACKFOLLOW
      CREATE INDEX fki_fkey_stackfollow_followed_id ON launchpad.stackfollow USING btree (stack_followed_id);
      CREATE INDEX fki_fkey_stackfollow_follower_id ON launchpad.stackfollow USING btree (user_follower_id);


      --HUNCH
      CREATE INDEX fki_fkey_hunch_user_id ON launchpad.hunch USING btree (user_id);
      CREATE INDEX fki_fkey_hunch_inst_id ON launchpad.hunch USING btree (inst_id);


      CREATE INDEX idx_stacks_name ON launchpad.stack USING btree (name);

      --inst_scalar_props
      CREATE INDEX fki_fkey_inst_scalar_props_inst_id ON launchpad.inst_scalar_props USING btree (inst_id);

      create or replace procedure launchpad.update_inst_scalar_props_is_traded()
      language plpgsql
        as
        $$
      begin
        insert into launchpad.inst_scalar_props(inst_id, is_traded)
          select i.id as inst_id,
          (
            (ff.feed = 'APEX')
            AND
            (e.name = ANY(ARRAY['AMEX', 'NYSE', 'NMS', 'ARCA']))
          ) as is_traded
        from instruments.inst i
        join instruments.inst_feed ff on (ff.inst_id = i.id)
        join instruments.exchange e on (i.exchange_id = e.id)
          where ff.feed = 'APEX'
          on conflict (inst_id) do update set is_traded=EXCLUDED.is_traded;
        end;
        $$;

      --==================FOREIGN KEY CONSTRAINTS==================--
      --THEME_INST
      ALTER TABLE ONLY launchpad.theme_inst
          ADD CONSTRAINT fkey_inst_id FOREIGN KEY (inst_id) REFERENCES instruments.inst(id);
      ALTER TABLE ONLY launchpad.theme_inst
          ADD CONSTRAINT fkey_theme_id FOREIGN KEY (theme_id) REFERENCES launchpad.theme(id) ON DELETE CASCADE;

      --STACK_INST
      ALTER TABLE ONLY launchpad.stack_inst
          ADD CONSTRAINT fkey_inst_id FOREIGN KEY (inst_id) REFERENCES instruments.inst(id);

      ALTER TABLE ONLY launchpad.stack_inst
          ADD CONSTRAINT fkey_stack_id FOREIGN KEY (stack_id) REFERENCES launchpad.stack(id) ON DELETE CASCADE;

      --TAG
      ALTER TABLE ONLY launchpad.tag
          ADD CONSTRAINT fkey_theme_id FOREIGN KEY (theme_id) REFERENCES launchpad.theme(id);
      ALTER TABLE ONLY launchpad.tag
          ADD CONSTRAINT fkey_user_id FOREIGN KEY (user_id) REFERENCES launchpad."user"(id);
      ALTER TABLE ONLY launchpad.tag
          ADD CONSTRAINT fkey_inst_id FOREIGN KEY (inst_id) REFERENCES instruments.inst(id);

      --USERFOLLOW
      ALTER TABLE ONLY launchpad.userfollow
          ADD CONSTRAINT fkey_user_followed_id FOREIGN KEY (user_followed_id) REFERENCES launchpad."user"(id);

      ALTER TABLE ONLY launchpad.userfollow
          ADD CONSTRAINT fkey_user_follower_id FOREIGN KEY (user_follower_id) REFERENCES launchpad."user"(id);

      ALTER TABLE launchpad.userfollow ADD CONSTRAINT unique_follow UNIQUE(user_follower_id, user_followed_id);

      --STACKFOLLOW
      ALTER TABLE ONLY launchpad.stackfollow
          ADD CONSTRAINT fkey_stack_followed_id FOREIGN KEY (stack_followed_id) REFERENCES launchpad.stack(id);

      ALTER TABLE ONLY launchpad.stackfollow
          ADD CONSTRAINT fkey_user_follower_id FOREIGN KEY (user_follower_id) REFERENCES launchpad."user"(id);

      --HUNCHFOLLOW
      ALTER TABLE ONLY launchpad.hunchfollow
          ADD CONSTRAINT fkey_hunch_followed_id FOREIGN KEY (hunch_followed_id) REFERENCES launchpad.hunch(id);

      ALTER TABLE ONLY launchpad.hunchfollow
          ADD CONSTRAINT fkey_user_follower_id FOREIGN KEY (user_follower_id) REFERENCES launchpad."user"(id);

      --STACK
      ALTER TABLE ONLY launchpad.stack
          ADD CONSTRAINT fkey_user_id FOREIGN KEY (user_id) REFERENCES launchpad."user"(id);

      ALTER TABLE launchpad.stack ADD CONSTRAINT unique_stack_name UNIQUE(name);
      ALTER TABLE launchpad.stack ADD CONSTRAINT non_empty_name CHECK (length(name) > 0);

      --COMMSTACK_INST
      ALTER TABLE ONLY launchpad.commstack_inst
          ADD CONSTRAINT fkey_inst_id FOREIGN KEY (inst_id) REFERENCES instruments.inst(id);

      ALTER TABLE ONLY launchpad.commstack_inst
          ADD CONSTRAINT fkey_commstack_id FOREIGN KEY (commstack_id) REFERENCES launchpad.commstack(id) ON DELETE CASCADE;

      --HUNCH
      ALTER TABLE ONLY launchpad.hunch
          ADD CONSTRAINT fkey_inst_id FOREIGN KEY (inst_id) REFERENCES instruments.inst(id);
      ALTER TABLE ONLY launchpad.hunch
          ADD CONSTRAINT fkey_user_id FOREIGN KEY (user_id) REFERENCES launchpad."user"(id);

      --====================================================================--
      -- launchpad.achievement
      --====================================================================--
      CREATE TABLE IF NOT EXISTS launchpad.achievement (
        id BIGINT GENERATED ALWAYS AS IDENTITY,
        name character varying(255) NOT NULL,
        level BIGINT NOT NULL CONSTRAINT positive_level CHECK (level > 0),
        icon character varying(65536)
      );
      SELECT logs.add_logger('launchpad', 'achievement');
      ALTER TABLE ONLY launchpad.achievement
        ADD CONSTRAINT pkey_achievement_id PRIMARY KEY (id);


      --====================================================================--
      -- launchpad.userachievement
      --====================================================================--
      CREATE TABLE IF NOT EXISTS launchpad.userachievement (
        id BIGINT GENERATED ALWAYS AS IDENTITY,
        user_id BIGINT NOT NULL,
        achievement_id BIGINT NOT NULL,
        UNIQUE (user_id, achievement_id)
      );
      SELECT logs.add_logger('launchpad', 'userachievement');

      ALTER TABLE ONLY launchpad.userachievement
        ADD CONSTRAINT pkey_userachievement_id PRIMARY KEY (id);

      --==================FOREIGN KEY CONSTRAINTS==================--
      -- USER
      ALTER TABLE ONLY launchpad.userachievement
        ADD CONSTRAINT fkey_user_id FOREIGN KEY (user_id) REFERENCES launchpad."user"(id);

      -- ACHIEVMENT
      ALTER TABLE ONLY launchpad.userachievement
        ADD CONSTRAINT fkey_achievement_id FOREIGN KEY (achievement_id) REFERENCES launchpad.achievement(id);

      --==================INDEX FOR FOREIGN KEYS==================--
      CREATE INDEX fki_fkey_userachievement_user_id ON launchpad.userachievement USING btree (user_id);
      CREATE INDEX fki_fkey_userachievement_achievement_id ON launchpad.userachievement USING btree (achievement_id);


      -- MARKETDATA

      CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

      drop schema if exists marketdata cascade;
      create schema marketdata;

      create table marketdata.stock_prices_daily(
        ts_date date NOT NULL,
        inst_id bigint NOT NULL,
        price_open numeric check(price_open >0),
        price_close numeric check(price_close >0),
        price_high numeric check(price_high >0),
        price_low numeric check(price_low >0),
        feed TEXT NOT NULL
      );

      ALTER TABLE marketdata.stock_prices_daily
        ADD CONSTRAINT fkey_stock_prices_daily_inst_id FOREIGN KEY (inst_id) REFERENCES instruments.inst(id);
      CREATE INDEX stock_prices_daily_inst_id
        ON marketdata.stock_prices_daily USING btree (inst_id);
      ALTER TABLE marketdata.stock_prices_daily
        ADD CONSTRAINT pkey_stock_prices_daily_ts_date_inst_id_feed PRIMARY KEY (ts_date, inst_id, feed);

      SELECT create_hypertable(
        'marketdata.stock_prices_daily',
        'ts_date',
        chunk_time_interval => INTERVAL '30 days',
        migrate_data=>true
      );
      SELECT add_dimension('marketdata.stock_prices_daily', 'feed', 2);


        ALTER TABLE marketdata.stock_prices_daily ADD CONSTRAINT fkey_stock_prices_daily_feed FOREIGN KEY (feed) REFERENCES instruments.feed;


        CREATE OR REPLACE VIEW marketdata.view_stock_prices_daily
        AS
        SELECT stock_prices_daily.ts_date,
               stock_prices_daily.inst_id,
               stock_prices_daily.price_open,
               stock_prices_daily.price_close,
               stock_prices_daily.price_high,
               stock_prices_daily.price_low
        FROM marketdata.stock_prices_daily
        where feed = 'MORNING_STAR';


        CREATE OR REPLACE VIEW marketdata.view_stock_prices_weekly
        AS
        SELECT time_bucket('7 days'::interval, stock_prices_daily.ts_date) AS ts_date,
               stock_prices_daily.inst_id,
               avg(stock_prices_daily.price_open)::numeric(6,2) AS price_open,
               avg(stock_prices_daily.price_close)::numeric(6,2) AS price_close,
               avg(stock_prices_daily.price_high)::numeric(6,2) AS price_high,
               avg(stock_prices_daily.price_low)::numeric(6,2) AS price_low
        FROM marketdata.stock_prices_daily
        where feed = 'MORNING_STAR'
        GROUP BY (time_bucket('7 days'::interval, stock_prices_daily.ts_date)), stock_prices_daily.inst_id
        ORDER BY (time_bucket('7 days'::interval, stock_prices_daily.ts_date)) DESC, (avg(stock_prices_daily.price_open)) DESC;


        CREATE OR REPLACE VIEW marketdata.view_stock_prices_monthly
        AS
        SELECT time_bucket('30 days'::interval, stock_prices_daily.ts_date) AS ts_date,
               stock_prices_daily.inst_id,
               avg(stock_prices_daily.price_open)::numeric(6,2) AS price_open,
               avg(stock_prices_daily.price_close)::numeric(6,2) AS price_close,
               avg(stock_prices_daily.price_high)::numeric(6,2) AS price_high,
               avg(stock_prices_daily.price_low)::numeric(6,2) AS price_low
        FROM marketdata.stock_prices_daily
        where feed = 'MORNING_STAR'
        GROUP BY (time_bucket('30 days'::interval, stock_prices_daily.ts_date)), stock_prices_daily.inst_id
        ORDER BY (time_bucket('30 days'::interval, stock_prices_daily.ts_date)) DESC, (avg(stock_prices_daily.price_open)) DESC;


        DROP MATERIALIZED VIEW IF EXISTS marketdata.view_stock_prices_last;
        CREATE MATERIALIZED VIEW marketdata.view_stock_prices_last
            TABLESPACE pg_default
        AS
        SELECT s.inst_id,
               s.price_open,
               s.price_close,
               s.price_high,
               s.price_low,
               j.feed    as price_feed,
               j.ts_date as price_date
        FROM marketdata.stock_prices_daily s
           INNER JOIN (SELECT DISTINCT on (inst_id) inst_id, ts_date, feed
                       FROM marketdata.stock_prices_daily m
                       WHERE m.ts_date <= now()
                       ORDER BY inst_id DESC, ts_date DESC, array_position(array ['MORNING_STAR', 'APEX'], feed)
        ) j on j.inst_id = s.inst_id and j.ts_date = s.ts_date and j.feed = s.feed
        WITH DATA;


        CREATE OR REPLACE VIEW marketdata.view_stock_prices_last_dates
        AS
        SELECT MAX(ts_date) AS "lastPriceDate", inst_id, feed
        FROM marketdata.stock_prices_daily
        GROUP BY inst_id, feed;



        ALTER TABLE IF EXISTS instruments.inst
        ADD CONSTRAINT key_inst_symbol_exchange_id UNIQUE (symbol, exchange_id);
      ALTER TABLE IF EXISTS instruments.inst
        ADD CONSTRAINT key_inst_cusip UNIQUE (cusip);

      --==============================================================---

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
          SELECT id, country, exchange_id, symbol
          INTO inst_id, country_tmp, ex_id_tmp, symbol_tmp
          FROM instruments.inst
          WHERE cusip = u_cusip;

          IF inst_id IS NOT NULL
          THEN -- The table have the passed cusip
          -- In case cusip is passed, symbol is not updated
            u_symbol := symbol_tmp;
            u_country := COALESCE(u_country, country_tmp);
            u_ex_id := COALESCE(u_ex_id, ex_id_tmp);

            IF EXISTS(SELECT 1 FROM instruments.inst WHERE id != inst_id AND symbol = u_symbol AND country = u_country)
            THEN
              -- If uniqueness of symbol + country can be violated, country is not updated
              u_country := NULL;
            END IF;
            IF u_ex_id IS NOT NULL
              AND EXISTS(SELECT 1
                         FROM instruments.inst
                         WHERE id != inst_id AND symbol = u_symbol AND exchange_id = u_ex_id)
            THEN
              -- If the uniqueness of symbol + exchange_id can be violated, exchange_id is not updated
              u_ex_id := NULL;
            END IF;

            UPDATE instruments.inst
            SET country          = COALESCE(u_country, country)
              , description      = COALESCE(u_descr, description)
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
            inst_id := (SELECT id FROM instruments.inst WHERE symbol = u_symbol AND country = u_country);
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
                SET country          = COALESCE(u_country, country)
                  , description      = COALESCE(u_descr, description)
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
                  INTO instruments.inst ( country, cusip, description, exchange_id, sedol, shortdescription, symbol
                                        , type)
                  VALUES (u_country, u_cusip, u_descr, u_ex_id, u_sedol, u_short_descr, u_symbol, u_type)
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
          inst_id := (SELECT id FROM instruments.inst WHERE symbol = u_symbol AND country = u_country);
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
              SET country          = COALESCE(u_country, country)
                , description      = COALESCE(u_descr, description)
                , sedol            = COALESCE(u_sedol, sedol)
                , shortdescription = COALESCE(u_short_descr, shortdescription)
                , type             = COALESCE(u_type, type)
              WHERE symbol = u_symbol
                AND exchange_id = u_ex_id;
            ELSE
              BEGIN
                -- If the transferred data does not conflict with any of the three unique constraints, insert the record
                INSERT
                INTO instruments.inst (country, cusip, description, exchange_id, sedol, shortdescription, symbol, type)
                VALUES (u_country, u_cusip, u_descr, u_ex_id, u_sedol, u_short_descr, u_symbol, u_type)
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
      --==============================================================---

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
        -- Structure: [ [old_symbol, new_symbol, exchange_name], ...]

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
          WITH name_changes_cte (old_symbol, new_symbol, exchange_id) AS
                 (
                   SELECT old_symbol, new_symbol, ex.id AS exchange_id
                   FROM (SELECT (instruments_name_change_array)[s][1]::varchar AS "old_symbol"
                              , (instruments_name_change_array)[s][2]::varchar AS "new_symbol"
                              , (instruments_name_change_array)[s][3]::varchar AS "exchange_name"
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
                             AND T.exchange_id = ct.exchange_id);
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
