Sequel.migration do
  change do
    alter_table :members do
      add_column :wheelchair_user, :boolean, default: false
    end
  end
end
