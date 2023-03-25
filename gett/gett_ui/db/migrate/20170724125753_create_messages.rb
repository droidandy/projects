Sequel.migration do
  change do
    create_table :messages do
      primary_key :id
      foreign_key :sender_id, :users
      foreign_key :company_id, :companies
      String :body, null: false

      timestamps
    end
  end
end
