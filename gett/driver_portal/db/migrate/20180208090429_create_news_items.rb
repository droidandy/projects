class CreateNewsItems < ActiveRecord::Migration[5.1]
  def change
    create_table :news_items do |t|
      t.string :title
      t.string :image
      t.text :content
      t.datetime :published_at
      t.belongs_to :author
      t.string :state
      t.string :item_type
      t.integer :likes_count, default: 0
      t.integer :comments_count, default: 0
      t.float :number

      t.timestamps
    end
  end
end
