Sequel.migration do
  up do
    drop_table :gett_drivers
  end

  down do
    create_table :gett_drivers do
      primary_key :id
      String :name
      String :phone_number
      String :image_url
      String :license_plate

      timestamps
      index :license_plate
    end
  end
end
