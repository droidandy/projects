Sequel.migration do
  change do
    alter_table :companies do
      add_column :multiple_booking, 'Boolean', default: true, null: false
    end
  end
end
