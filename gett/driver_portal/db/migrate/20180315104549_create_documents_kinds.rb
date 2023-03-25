class CreateDocumentsKinds < ActiveRecord::Migration[5.1]
  def change
    create_table :documents_kinds do |t|
      t.string :title
      t.string :slug
      t.boolean :mandatory, default: false, null: false
      t.string :owner

      t.timestamps
    end
  end
end
