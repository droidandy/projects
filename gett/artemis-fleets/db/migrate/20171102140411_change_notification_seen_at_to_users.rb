class ChangeNotificationSeenAtToUsers < ActiveRecord::Migration[5.1]
  def change
    change_column :users, :notification_seen_at, :datetime
  end
end
