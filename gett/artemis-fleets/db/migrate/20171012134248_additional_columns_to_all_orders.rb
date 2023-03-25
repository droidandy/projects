class AdditionalColumnsToAllOrders < ActiveRecord::Migration[5.1]
  def change
    change_table :orders do |t|
      t.string :driver_photo
      t.string :driver_car_model
      t.string :driver_taxi_reg
      t.string :driver_device_type
      t.string :passenger_name
      t.datetime :order_cancelled_at
      t.datetime :order_rejected_at
      t.string :order_status_name
    end
  end
end
