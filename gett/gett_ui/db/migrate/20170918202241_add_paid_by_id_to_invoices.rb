Sequel.migration do
  change do
    alter_table :invoices do
      add_foreign_key :paid_by_id, :users
    end
  end
end
