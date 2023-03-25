class CreateDriverReports < ActiveRecord::Migration[5.1]
  def change
    create_table :driver_reports do |t|
      t.integer :fleet_id

      t.integer :driver_id
      t.string :driver_name
      t.string :driver_phone
      t.integer :completed_for_period
      t.float :acceptance_for_period
      t.float :avg_rating_for_period

      t.datetime :created_at, null: false
    end
  end
end
