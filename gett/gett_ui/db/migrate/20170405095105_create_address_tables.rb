Sequel.migration do
  up do
    create_table :addresses do
      primary_key :id
      String :line
      Float :lat
      Float :lng

      timestamps
    end

    create_table :company_addresses do
      primary_key :id
      foreign_key :company_id, :companies, null: false
      foreign_key :address_id, :addresses, null: false
      Boolean :legal, null: false, default: false

      timestamps

      index [:company_id, :address_id], uniq: true
    end

    alter_table :companies do
      drop_column :address
      drop_column :legal_address
    end
  end

  down do
    alter_table :companies do
      add_column :address, String
      add_column :legal_address, String
    end

    drop_table :company_addresses
    drop_table :addresses
  end
end
