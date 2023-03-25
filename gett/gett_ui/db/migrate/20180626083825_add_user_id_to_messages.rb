Sequel.migration do
  change do
    alter_table :messages do
      add_foreign_key :recipient_id, :users, index: true

      add_index :company_id
    end
  end
end
