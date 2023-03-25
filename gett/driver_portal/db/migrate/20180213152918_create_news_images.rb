class CreateNewsImages < ActiveRecord::Migration[5.1]
  def change
    create_table :news_images do |t|
      t.references :news_item
      t.string :image
      t.string :binding_hash

      t.timestamps
    end
  end
end
