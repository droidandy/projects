class AddApiFieldsToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :gett_id, :integer
    add_column :users, :phone, :string
    add_column :users, :address, :string
    add_column :users, :city, :string
    add_column :users, :postcode, :string
    add_column :users, :account_number, :string
    add_column :users, :sort_code, :string
    add_column :users, :string, :string
    add_column :users, :badge_number, :string
    add_column :users, :vehicle_colour, :string
    add_column :users, :vehicle_type, :string
    add_column :users, :vehicle_reg, :string
  end
end
