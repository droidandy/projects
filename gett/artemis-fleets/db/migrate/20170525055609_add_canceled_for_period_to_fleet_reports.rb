class AddCanceledForPeriodToFleetReports < ActiveRecord::Migration[5.1]
  def change
    add_column :fleet_reports, :canceled_for_period, :integer
  end
end
