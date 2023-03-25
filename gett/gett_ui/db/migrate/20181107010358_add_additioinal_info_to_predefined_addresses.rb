Sequel.migration do
  change do
    alter_table :predefined_addresses do
      add_column :street_name,       String
      add_column :street_number,     String
      add_column :point_of_interest, String
    end
  end
end
