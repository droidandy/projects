Sequel.migration do
  change do
    alter_table :company_infos do
      add_foreign_key :account_manager_id, :users
    end
  end
end
