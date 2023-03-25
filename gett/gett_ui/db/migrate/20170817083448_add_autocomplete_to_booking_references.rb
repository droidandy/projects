Sequel.migration do
  change do
    alter_table :booking_references do
      add_column :dropdown, 'Boolean', default: false, null: false
    end
  end
end
