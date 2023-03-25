class CreateFutureOrders < ActiveRecord::Migration[5.1]
  def change
    create_table :future_orders do |t|
      t.integer :fleet_id

      t.integer :order_id
      t.datetime :scheduled_at
      t.integer :driver_id
      t.string :driver_name
      t.string :driver_phone
      t.integer :driver_status
      t.string :driver_location
      t.string :pickup_address
      t.string :pickup_location
      t.string :destination_address
      t.string :destination_location
      t.integer :order_status

      t.datetime :created_at, null: false
    end
  end
end
