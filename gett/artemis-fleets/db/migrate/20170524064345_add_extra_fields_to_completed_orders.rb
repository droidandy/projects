class AddExtraFieldsToCompletedOrders < ActiveRecord::Migration[5.1]
  def change
    change_table :completed_orders do |t|
      t.datetime :order_received
      t.datetime :pickup_time
      t.datetime :will_arrive_at
      t.datetime :arrived_at
      t.integer :waiting_time_minutes
      t.datetime :passanger_on_board
      t.datetime :order_ended_at
      t.float :driver_rating
    end
  end
end
