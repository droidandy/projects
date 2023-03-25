Sequel.migration do
  change do
    create_table :special_requirements do
      primary_key :id

      String :service_type, null: false
      String :key,   null: false
      String :label, null: false

      index [:service_type, :key], uniq: true

      timestamps
    end

    create_table :companies_special_requirements do
      foreign_key :company_id, :companies, null: false
      foreign_key :special_requirement_id, :special_requirements, null: false

      index [:company_id, :special_requirement_id], unique: true
    end
  end
end
