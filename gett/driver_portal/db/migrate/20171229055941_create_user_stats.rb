class CreateUserStats < ActiveRecord::Migration[5.1]
  def change
    create_table :user_stats do |t|
      t.belongs_to :user
      t.integer :completed_orders, default: 0
      t.integer :cancelled_orders, default: 0
      t.float :cash_fare, default: 0
      t.float :card_fare, default: 0
      t.float :tips, default: 0

      t.timestamps
    end
  end
end
