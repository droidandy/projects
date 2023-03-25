Sequel.migration do
  up do
    alter_table :company_infos do
      set_column_type :account_number, String
      set_column_type :sort_code, String
    end
  end

  down do
    alter_table :company_infos do
      set_column_type :account_number, Integer, using: "account_number::integer"
      set_column_type :sort_code, Integer, using: "sort_code::integer"
    end
  end
end
