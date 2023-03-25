class CreateComments < ActiveRecord::Migration[5.1]
  def change
    create_table :comments do |t|
      t.belongs_to :user
      t.bigint :commentable_id
      t.string :commentable_type
      t.text :content

      t.timestamps
    end
    add_index :comments, %i[commentable_id commentable_type]
  end
end
