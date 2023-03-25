class AddViewsCountToNewsItems < ActiveRecord::Migration[5.1]
  def change
    add_column :news_items, :views_count, :integer, default: 0
  end
end
