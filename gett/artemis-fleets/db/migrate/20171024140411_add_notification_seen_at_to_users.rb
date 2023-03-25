class AddNotificationSeenAtToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :notification_seen_at, :date
  end
end
