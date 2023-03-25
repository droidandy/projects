Sequel.migration do
  change do
    create_table :predefined_addresses do
      primary_key :id
      String :name, null: false
      String :additional_terms
      String :postcode
      Float :lat
      Float :lng
    end
  end
end
