class CreateDocuments < ActiveRecord::Migration[5.1]
  def change
    create_table :documents do |t|
      t.references :user
      t.references :kind
      t.string :file
      t.datetime :expires_at
      t.boolean :hidden, default: false, nill: false

      t.timestamps
    end
  end
end
