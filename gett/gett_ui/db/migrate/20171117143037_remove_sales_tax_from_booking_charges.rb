Sequel.migration do
  up do
    alter_table :booking_charges do
      drop_column :sales_tax
    end
  end

  down do
    alter_table :booking_charges do
      add_column :sales_tax, Integer, null: false, default: 0
    end
  end
end
