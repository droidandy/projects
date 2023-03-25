class CreateAllOrders < ActiveRecord::Migration[5.1]
  def change
    create_table :orders do |t|
      t.integer :fleet_id

      t.integer :order_id
      t.datetime :scheduled_at
      t.integer :driver_id
      t.string :driver_name
      t.string :driver_phone
      t.integer :driver_status
      t.string :pickup_address
      t.string :pickup_location
      t.string :destination_address
      t.string :destination_location
      t.integer :order_status

      t.text :path_points

      t.string :driver_type

      t.datetime :order_received
      t.datetime :pickup_time
      t.datetime :will_arrive_at
      t.datetime :arrived_at
      t.integer :waiting_time_minutes
      t.datetime :passanger_on_board
      t.datetime :order_ended_at
      t.float :driver_rating

      t.datetime :created_at, null: false
    end
  end
end
