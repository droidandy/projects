class AddPathPointsToCompletedOrders < ActiveRecord::Migration[5.1]
  def change
    add_column :completed_orders, :path_points, :text
  end
end
