class AddGtIdToVehicles < ActiveRecord::Migration[5.1]
  def change
    add_column :vehicles, :gt_id, :integer
  end
end
