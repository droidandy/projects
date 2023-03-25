class AddQueueTimestampToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :ready_for_approval_since, :datetime

    add_index :users, :ready_for_approval_since
  end
end
