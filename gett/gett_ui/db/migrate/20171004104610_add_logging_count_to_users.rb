Sequel.migration do
  change do
    alter_table :users do
      add_column :login_count, :integer, default: 0
    end
  end
end
