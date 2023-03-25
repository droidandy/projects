class AddContentTypeToDocuments < ActiveRecord::Migration[5.1]
  def change
    add_column :documents, :content_type, :string
  end
end
