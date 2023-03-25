Sequel.migration do
  change do
    alter_table :companies do
      add_column :customer_care_password, String
    end
  end
end
