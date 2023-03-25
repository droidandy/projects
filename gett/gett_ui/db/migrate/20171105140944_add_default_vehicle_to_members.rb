Sequel.migration do
  change do
    add_column :members, :default_vehicle, String
  end
end
