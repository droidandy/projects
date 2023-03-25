Sequel.migration do
  change do
    alter_table :members do
      add_column :notify_with_push, 'Boolean', default: true, null: false
    end
  end
end
