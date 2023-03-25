class CreateDocumentsFields < ActiveRecord::Migration[5.1]
  def change
    create_table :documents_fields do |t|
      t.belongs_to :kind
      t.string :label
      t.string :name
      t.string :field_type
      t.boolean :mandatory, default: false, null: false

      t.timestamps
    end
  end
end
