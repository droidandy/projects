class AddStatusToModels < ActiveRecord::Migration[5.1]
  def change
    add_column :documents, :approval_status, :integer, default: 0, null: false
    add_column :vehicles, :approval_status, :integer, default: 0, null: false
    add_column :users, :approval_status, :integer, default: 0, null: false
  end
end
