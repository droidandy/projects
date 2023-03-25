Sequel.migration do
  change do
    alter_table :companies do
      add_column :sap_id, String
    end
  end
end
