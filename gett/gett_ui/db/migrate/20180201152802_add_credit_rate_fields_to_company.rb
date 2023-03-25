Sequel.migration do
  change do
    alter_table :companies do
      add_column :credit_rate_registration_number, String
      add_column :credit_rate_incorporated_at, Date
      add_column :credit_rate_status, String, default: 'na', nil: false
    end
  end
end
