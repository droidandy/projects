Sequel.migration do
  up do
    create_table :travel_reasons do
      primary_key :id
      foreign_key :company_id, :companies, null: false
      String :name, null: false

      timestamps
    end

    alter_table :bookings do
      add_foreign_key :travel_reason_id, :travel_reasons
    end
  end

  down do
    alter_table :bookings do
      drop_column :travel_reason_id
    end

    drop_table :travel_reasons
  end
end
