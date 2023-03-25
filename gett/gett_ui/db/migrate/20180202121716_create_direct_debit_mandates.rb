Sequel.migration do
  change do
    create_enum :direct_debit_mandate_status, %w(initiated pending active failed cancelled)

    create_table :direct_debit_mandates do
      primary_key :id
      foreign_key :company_id, :companies, null: false, index: true
      foreign_key :created_by_id, :users, null: false, index: true
      String :go_cardless_redirect_flow_id, null: false
      String :go_cardless_mandate_id
      column :status, :direct_debit_mandate_status, null: false

      timestamps
    end
  end
end
