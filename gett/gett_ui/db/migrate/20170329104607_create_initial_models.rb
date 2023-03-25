Sequel.migration do
  change do
    create_table :users do
      primary_key :id
      String :email, null: false, unique: true
      String :password_digest
      String :kind

      timestamps
    end

    create_table :roles do
      primary_key :id
      String :name, null: false, default: 'booker'

      timestamps
    end

    create_table :companies do
      primary_key :id
      String :name, null: false
      Boolean :active, null: false, default: true
      String :address
      String :vat_number
      String :sales_person
      String :logo_url
      String :cost_centre
      String :legal_name
      String :legal_address
      Boolean :destination_required, default: false
      Boolean :booking_reference_required, default: false
      Boolean :booking_reference_validation, default: false

      timestamps
    end

    create_table :bookers do
      foreign_key :id, :users

      foreign_key :company_id, :companies, null: false
      foreign_key :role_id, :roles, null: false
      Boolean :active, null: false, default: true
      String :first_name, null: false
      String :last_name, null: false
      String :phone
      String :mobile
      String :work
      String :reference
      String :department
      String :division
    end

    create_table :payment_options do
      primary_key :id
      foreign_key :company_id, :companies, null: false

      String :payment_type, null: false, default: 'account'
      Float :booking_fee
      Float :run_in_fee
      Float :tips
      Float :handling_fee
      Float :business_credit

      timestamps
    end

    create_table :booking_references do
      primary_key :id
      foreign_key :company_id, :companies, null: false

      String :name, null: false
      Boolean :active, default: true

      timestamps
    end

    create_table :reference_entries do
      primary_key :id
      foreign_key :booking_reference_id, :booking_references, null: false

      String :value, null: false
      index :value
    end
  end
end
