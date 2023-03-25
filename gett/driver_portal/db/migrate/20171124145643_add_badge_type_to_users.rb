class AddBadgeTypeToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :badge_type, :string
  end
end
