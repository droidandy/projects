class AddIsFrozenToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :is_frozen, :boolean, default: false, null: false
  end
end
