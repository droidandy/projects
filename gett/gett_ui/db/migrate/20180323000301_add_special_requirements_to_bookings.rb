Sequel.migration do
  change do
    alter_table :bookings do
      add_column :special_requirements, 'text[]', default: Sequel.pg_array([], :text)
    end
  end
end
