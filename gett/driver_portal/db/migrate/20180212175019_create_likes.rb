class CreateLikes < ActiveRecord::Migration[5.1]
  def change
    create_table :likes do |t|
      t.references :user
      t.bigint :likeable_id
      t.string :likeable_type

      t.timestamps
    end

    add_index :likes, %i[likeable_id likeable_type]
  end
end
