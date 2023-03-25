class CreateViews < ActiveRecord::Migration[5.1]
  def change
    create_table :views do |t|
      t.references :user
      t.bigint :viewable_id
      t.string :viewable_type

      t.timestamps
    end

    add_index :views, %i[viewable_id viewable_type]
  end
end
