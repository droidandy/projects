Sequel.migration do
  change do
    alter_table :users do
      add_column :invalid_passwords_count, :integer, default: 0, null: false
      add_column :locks_count, :integer, default: 0, null: false
      add_column :locked, :boolean, default: false, null: false
    end
  end
end
