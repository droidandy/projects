Sequel.migration do
  up do
    alter_table :predefined_addresses do
      rename_column :name, :line
      rename_column :postcode, :postal_code
    end
  end

  down do
    alter_table :predefined_addresses do
      rename_column :line, :name
      rename_column :postal_code, :postcode
    end
  end
end
