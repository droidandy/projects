class AddTrendingIndexToNewsItems < ActiveRecord::Migration[5.1]
  def change
    add_column :news_items, :trending_index, :integer, default: 0, null: false
  end
end
