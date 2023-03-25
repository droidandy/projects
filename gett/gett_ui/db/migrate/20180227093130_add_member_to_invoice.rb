Sequel.migration do
  change do
    alter_table :invoices do
      add_foreign_key :member_id, :users
    end
  end
end
