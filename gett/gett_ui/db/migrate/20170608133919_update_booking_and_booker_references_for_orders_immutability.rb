using Sequel::CoreRefinements

Sequel.migration do
  up do
    alter_table :booking_references do
      set_column_allow_null :name
    end

    alter_table :booker_references do
      add_column :booking_reference_name, String
    end

    from(:booker_references, :booking_references)
      .where(:booker_references[:booking_reference_id] => :booking_references[:id])
      .update(booking_reference_name: :booking_references[:name])

    alter_table :booker_references do
      drop_column :booking_reference_id, cascade: true
      set_column_not_null(:booking_reference_name)

      add_index :booking_reference_name
    end
  end

  down do
    alter_table :booker_references do
      add_column :booking_reference_id, Integer
      add_foreign_key [:booking_reference_id], :booking_references
    end

    from(:booker_references, :bookings, :members, :booking_references)
      .where(
        :booker_references[:booking_id] => :bookings[:id],
        :bookings[:booker_id] => :members[:id],
        :booking_references[:company_id] => :members[:company_id],
        :booker_references[:booking_reference_name] => :booking_references[:name]
      )
      .update(booking_reference_id: :booking_references[:id])

    alter_table :booker_references do
      drop_column :booking_reference_name, cascade: true
      set_column_not_null(:booking_reference_id)
    end

    alter_table :booking_references do
      set_column_not_null :name
    end
  end
end
