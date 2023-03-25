Sequel.migration do
  change do
    alter_table :company_infos do
      add_column :account_number, Integer
      add_column :sort_code, Integer
    end
  end
end
