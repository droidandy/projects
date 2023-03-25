class AddLoginCountToStatisticsEntries < ActiveRecord::Migration[5.1]
  def change
    add_column :statistics_entries, :login_count, :integer
  end
end
