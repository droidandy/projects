Sequel.migration do
  change do
    alter_table :invoices do
      add_foreign_key :created_by_id, :users, index: true
    end
  end
end
