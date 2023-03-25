Sequel.migration do
  change do
    alter_table :members do
      add_column :assigned_to_all_passengers, :boolean, default: false
    end
  end
end
