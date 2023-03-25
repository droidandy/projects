class RemoveStateFromNewsItems < ActiveRecord::Migration[5.1]
  def change
    remove_column :news_items, :state, :string
  end
end
