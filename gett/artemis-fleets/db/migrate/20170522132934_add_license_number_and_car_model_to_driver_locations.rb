class AddLicenseNumberAndCarModelToDriverLocations < ActiveRecord::Migration[5.1]
  def change
    add_column :driver_locations, :license_number, :string
    add_column :driver_locations, :car_model, :string
  end
end
