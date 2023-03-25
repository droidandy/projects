Sequel.migration do
  change do
    alter_table :user_devices do
      add_column :uuid, String, index: true, uniq: true
    end
  end
end
