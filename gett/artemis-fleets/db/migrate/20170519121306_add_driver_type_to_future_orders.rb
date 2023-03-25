class AddDriverTypeToFutureOrders < ActiveRecord::Migration[5.1]
  def change
    change_table :future_orders do |t|
      t.string :driver_type
    end
  end
end
