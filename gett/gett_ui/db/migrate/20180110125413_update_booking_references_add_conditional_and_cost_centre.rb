Sequel.migration do
  change do
    alter_table :booking_references do
      add_column :cost_centre, 'Boolean', null: false, default: false
      add_column :conditional, 'Boolean', null: false, default: false
    end
  end
end
