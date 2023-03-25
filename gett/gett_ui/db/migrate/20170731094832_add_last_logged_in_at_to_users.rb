Sequel.migration do
  change do
    alter_table :users do
      add_column :last_logged_in_at, DateTime
    end
  end
end
