Sequel.migration do
  change do
    create_table :company_signup_requests do
      primary_key :id

      String  :name, null: false
      String  :first_name
      String  :last_name
      String  :phone_number
      String  :email
      String  :country
      Float   :estimated_costs

      timestamps
    end
  end
end
