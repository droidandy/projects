Sequel.migration do
  change do
    create_table :company_links do
      foreign_key :company_id, :companies, null: false
      foreign_key :linked_company_id, :companies, null: false

      index [:company_id, :linked_company_id], unique: true
    end
  end
end
