Sequel.migration do
  change do
    alter_table :companies do
      add_column :fake, :boolean, null: false, default: false
    end
  end
end
