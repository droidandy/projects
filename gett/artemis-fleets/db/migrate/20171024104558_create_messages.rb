class CreateMessages < ActiveRecord::Migration[5.1]
  def change
    create_table :messages do |t|
      t.belongs_to :sender
      t.belongs_to :company
      t.string :body, null: false
      t.string :title

      t.timestamps
    end
  end
end
