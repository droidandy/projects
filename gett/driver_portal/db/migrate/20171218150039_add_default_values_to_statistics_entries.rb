class AddDefaultValuesToStatisticsEntries < ActiveRecord::Migration[5.1]
  def change
    change_column :statistics_entries, :login_count, :integer, default: 0
    change_column :statistics_entries, :active_users, :integer, default: 0
  end
end
