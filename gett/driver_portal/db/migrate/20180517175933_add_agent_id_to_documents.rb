class AddAgentIdToDocuments < ActiveRecord::Migration[5.1]
  def change
    add_reference :documents, :agent, index: true
  end
end
