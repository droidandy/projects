Sequel.migration do
  change do
    alter_table :payments do
      add_column :zooz_request_id, String
    end
  end
end
