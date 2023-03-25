Sequel.migration do
  up do
    create_enum :company_type, %w(enterprise affiliate)
    add_column :companies, :company_type, 'company_type', null: false, default: 'enterprise'
  end

  down do
    drop_column :companies, :company_type
    drop_enum :company_type
  end
end
