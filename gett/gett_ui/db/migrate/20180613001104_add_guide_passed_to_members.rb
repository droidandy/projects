Sequel.migration do
  change do
    alter_table :members do
      add_column :guide_passed, :Boolean, default: false
    end
  end
end
