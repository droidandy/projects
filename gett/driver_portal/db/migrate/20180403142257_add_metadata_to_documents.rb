class AddMetadataToDocuments < ActiveRecord::Migration[5.1]
  def change
    add_column :documents, :metadata, :jsonb, default: '{}', null: false
  end
end
