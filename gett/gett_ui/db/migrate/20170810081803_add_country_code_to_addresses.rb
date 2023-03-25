Sequel.migration do
  change do
    alter_table :addresses do
      add_column :country_code, String, null: false, default: 'GB'
    end

    alter_table :predefined_addresses do
      add_column :country_code, String, null: false, default: 'GB'
    end
  end
end
