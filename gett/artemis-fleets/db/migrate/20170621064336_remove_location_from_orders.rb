class RemoveLocationFromOrders < ActiveRecord::Migration[5.1]
  def change
    %i(future_orders active_orders completed_orders).each do |table|
      remove_column table, :driver_latitude
      remove_column table, :driver_longitude
    end
  end
end
