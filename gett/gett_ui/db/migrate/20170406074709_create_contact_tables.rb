Sequel.migration do
  change do
    create_table :contacts do
      primary_key :id

      foreign_key :company_id, :companies, null: false
      Boolean :primary, null: false, default: true
      String :phone
      String :mobile
      String :fax
      String :email
      String :first_name
      String :last_name

      timestamps
    end

    create_table :contact_addresses do
      primary_key :id
      foreign_key :address_id, :addresses, null: false
      foreign_key :contact_id, :contacts, null: false

      index [:address_id, :contact_id], unique: true
    end
  end
end
