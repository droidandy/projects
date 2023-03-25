Sequel.migration do
  change do
    create_table :short_urls do
      primary_key :id
      String :original_url, null: false, unique: true
      String :token, limit: 10, null: false, unique: true

      index :token
      index :original_url

      timestamps
    end
  end
end
