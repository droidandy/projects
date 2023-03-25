Sequel.migration do
  change do
    create_table :drivers_channels do
      primary_key :id

      String :channel,       null: false
      Point :location,       null: false
      DateTime :valid_until, null: false

      timestamps
    end
  end
end
