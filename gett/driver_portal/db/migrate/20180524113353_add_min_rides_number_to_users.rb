class AddMinRidesNumberToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :min_rides_number, :integer
    remove_column :users, :rides_threshold, :boolean
  end
end
