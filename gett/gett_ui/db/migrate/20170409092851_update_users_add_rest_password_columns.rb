Sequel.migration do
  change do
    alter_table :users do
      add_column :reset_password_token, String
      add_column :reset_password_sent_at, DateTime
    end
  end
end
