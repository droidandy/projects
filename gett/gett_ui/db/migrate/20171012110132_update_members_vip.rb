Sequel.migration do
  change do
    alter_table :members do
      add_column :vip, :boolean, default: false, null: false
    end
  end
end
