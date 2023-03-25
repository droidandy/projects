class CreateDriverLocations < ActiveRecord::Migration[5.1]
  def change
    create_table :driver_locations do |t|
      t.integer :fleet_id

      t.integer :driver_id
      t.string :driver_name
      t.string :driver_phone
      t.integer :status_id
      t.float :latitude
      t.float :longitude

      t.datetime :created_at, null: false
    end
  end
end
