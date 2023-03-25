using Sequel::CoreRefinements

Sequel.migration do
  up do
    extension :pg_triggers, :address_lookup_triggers

    alter_table :contacts do
      add_foreign_key :address_id, :addresses
    end

    from(:contacts, :contact_addresses)
      .where(:contacts[:id] => :contact_addresses[:contact_id])
      .update(address_id: :contact_addresses[:address_id])

    drop_table :contact_addresses

    alter_table :addresses do
      add_column :references_count, Integer, null: false, default: 0
    end

    add_address_reference(:contacts)
    add_address_reference(:booking_addresses)
    add_address_reference(:company_addresses)
    add_address_reference(:passenger_addresses)

    from(:addresses).update(references_count: 1)

    pgt_trigger(:addresses, "pgt_addresses_autodestroy_trg", "pgt_addresses_autodestroy_fn", [:update], <<-SQL, after: true)
    BEGIN
      IF (NEW.references_count = 0) THEN
        DELETE FROM addresses WHERE id = OLD.id;
      END IF;
      RETURN OLD;
    END;
    SQL
  end

  down do
    extension :pg_triggers, :address_lookup_triggers

    drop_address_reference(:contacts)
    drop_address_reference(:booking_addresses)
    drop_address_reference(:company_addresses)
    drop_address_reference(:passenger_addresses)

    drop_trigger(:addresses, "pgt_addresses_autodestroy_trg")
    drop_function("pgt_addresses_autodestroy_fn")

    create_table :contact_addresses do
      primary_key :id
      foreign_key :address_id, :addresses, null: false
      foreign_key :contact_id, :contacts, null: false

      index [:address_id, :contact_id], unique: true
    end

    from(:contact_addresses).insert(
      [:contact_id, :address_id],
      from(:contacts).select(:id, :address_id)
    )

    alter_table :contacts do
      drop_column :address_id
    end

    alter_table :addresses do
      drop_column :references_count
    end
  end
end
