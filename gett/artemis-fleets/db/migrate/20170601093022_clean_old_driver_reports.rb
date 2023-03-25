class CleanOldDriverReports < ActiveRecord::Migration[5.1]
  def change
    execute 'DELETE FROM driver_reports where period IS NULL'
  end
end
