class CreateStatisticsEntries < ActiveRecord::Migration[5.1]
  def change
    create_table :statistics_entries do |t|
      t.date :date
      t.integer :active_users

      t.timestamps
    end
  end
end
