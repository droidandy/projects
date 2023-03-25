module Sequel
  # DEPRECATED. Legacy module for old migrations. Do not use it.
  module AddressLookupTriggers
    ::Sequel::Database.register_extension(:address_lookup_triggers, self)

    def add_address_reference(table_name, column_name: :address_id, prefix: '')
      # https://github.com/jeremyevans/sequel_postgresql_triggers/blob/master/lib/sequel/extensions/pg_triggers.rb
      # The only difference from Sequel's #pgt_counter_cache is that we want triggers to happen AFTER events to be
      # able to safely auto-destroy Address record if it doesn't have any references.

      table = quote_schema_table(:addresses)
      id_column = quote_identifier(column_name)
      main_column = quote_identifier(:id)
      count_column = quote_identifier(:references_count)

      trigger_name = "pgt_cc_#{table_name}_#{prefix}address_reference_trg"
      function_name = "pgt_cc_#{table_name}_#{prefix}address_reference_fn"

      pgt_trigger(table_name, trigger_name, function_name, [:insert, :update, :delete], <<-SQL, after: true)
      BEGIN
        IF (TG_OP = 'UPDATE' AND (NEW.#{id_column} = OLD.#{id_column} OR (OLD.#{id_column} IS NULL AND NEW.#{id_column} IS NULL))) THEN
          RETURN NEW;
        ELSE
          IF ((TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.#{id_column} IS NOT NULL) THEN
            UPDATE #{table} SET #{count_column} = #{count_column} + 1 WHERE #{main_column} = NEW.#{id_column};
          END IF;
          IF ((TG_OP = 'DELETE' OR TG_OP = 'UPDATE') AND OLD.#{id_column} IS NOT NULL) THEN
            UPDATE #{table} SET #{count_column} = #{count_column} - 1 WHERE #{main_column} = OLD.#{id_column};
          END IF;
        END IF;
        IF (TG_OP = 'DELETE') THEN
          RETURN OLD;
        END IF;
        RETURN NEW;
      END;
      SQL
    end

    def drop_address_reference(table_name, prefix: '')
      drop_trigger(table_name, "pgt_cc_#{table_name}_#{prefix}address_reference_trg")
      drop_function("pgt_cc_#{table_name}_#{prefix}address_reference_fn")
    end
  end
end
