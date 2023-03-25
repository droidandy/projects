Sequel.migration do
  change do
    alter_table :payments do
      add_column :retries, :integer, null: false, default: 0
    end
  end
end
