Sequel.migration do
  change do
    alter_table :bookings do
      add_column :path_points, :jsonb
    end
  end
end
