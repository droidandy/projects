Sequel.migration do
  change do
    add_column :booking_charges, :manual, :boolean, default: false, null: false
  end
end
