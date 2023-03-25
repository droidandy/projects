class AddMetaBasedFieldsToDocuments < ActiveRecord::Migration[5.1]
  def change
    add_column :documents, :started_at, :datetime
    add_column :documents, :unique_id, :string
  end
end
