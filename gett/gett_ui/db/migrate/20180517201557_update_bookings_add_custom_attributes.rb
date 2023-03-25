Sequel.migration do
  change do
    alter_table :bookings do
      add_column :custom_attributes, :jsonb
    end
  end
end
