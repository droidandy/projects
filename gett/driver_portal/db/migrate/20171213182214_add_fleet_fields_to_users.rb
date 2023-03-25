class AddFleetFieldsToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :license_number, :string
    add_column :users, :rating, :float
    add_column :users, :today_acceptance, :float
    add_column :users, :week_acceptance, :float
    add_column :users, :month_acceptance, :float
    add_column :users, :total_acceptance, :float
  end
end
