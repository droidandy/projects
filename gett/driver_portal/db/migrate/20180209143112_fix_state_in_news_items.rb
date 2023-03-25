class FixStateInNewsItems < ActiveRecord::Migration[5.1]
  def change
    remove_column :news_items, :state, :string
    add_column :news_items, :state, :integer, default: 0, null: false
  end
end
