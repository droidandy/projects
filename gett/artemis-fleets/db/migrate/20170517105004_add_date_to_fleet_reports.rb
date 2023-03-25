class AddDateToFleetReports < ActiveRecord::Migration[5.1]
  def change
    change_table :fleet_reports do |t|
      t.date :date
    end
  end
end
