class ChangeGtIdToGettId < ActiveRecord::Migration[5.1]
  def change
    rename_column :vehicles, :gt_id, :gett_id
    rename_column :documents, :gt_id, :gett_id
  end
end
