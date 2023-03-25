class CreateStatements < ActiveRecord::Migration[5.1]
  def change
    create_table :statements do |t|
      t.belongs_to :user
      t.string :external_id
      t.string :pdf

      t.timestamps
    end
  end
end
