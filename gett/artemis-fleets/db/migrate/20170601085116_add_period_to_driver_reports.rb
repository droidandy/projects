class AddPeriodToDriverReports < ActiveRecord::Migration[5.1]
  def change
    add_column :driver_reports, :period, :integer
  end
end
