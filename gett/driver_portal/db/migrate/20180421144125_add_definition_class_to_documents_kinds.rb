class AddDefinitionClassToDocumentsKinds < ActiveRecord::Migration[5.1]
  def change
    add_column :documents_kinds, :definition_class, :string
  end
end
