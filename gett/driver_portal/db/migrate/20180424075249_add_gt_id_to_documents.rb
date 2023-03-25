class AddGtIdToDocuments < ActiveRecord::Migration[5.1]
  def change
    add_column :documents, :gt_id, :integer
  end
end
