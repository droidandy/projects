Sequel.migration do
  up do
    alter_table :booking_references do
      add_column :mandatory, 'Boolean', default: false, null: false
      add_column :validation_required, 'Boolean', default: false, null: false
    end
  end

  down do
    alter_table :booking_references do
      drop_column :mandatory
      drop_column :validation_required
    end
  end
end
