class AddAgentIdToReviews < ActiveRecord::Migration[5.1]
  def change
    add_column :reviews, :agent_id, :integer
  end
end
