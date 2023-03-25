Sequel.migration do
  change do
    create_table :company_credit_rates do
      primary_key :id
      foreign_key :company_id, :companies, null: false, index: true

      Integer :value
      Boolean :active, null: false, default: true

      timestamps
    end
  end
end
