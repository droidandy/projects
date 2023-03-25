class MakeVotesFromLikes < ActiveRecord::Migration[5.1]
  def change
    remove_column :news_items, :likes_count, :integer, default: 0
    add_column :comments, :likes_count, :integer, default: 0
    add_column :comments, :dislikes_count, :integer, default: 0
    add_column :likes, :value, :integer, null: false, default: 1
  end
end
