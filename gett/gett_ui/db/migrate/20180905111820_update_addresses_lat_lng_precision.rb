Sequel.migration do
  up do
    alter_table :addresses do
      set_column_type :lat, :numeric, size: [10, 7]
      set_column_type :lng, :numeric, size: [10, 7]
    end
  end

  down do
    alter_table :addresses do
      set_column_type :lat, :float
      set_column_type :lng, :float
    end
  end
end
