class CreateDocumentsStatusChanges < ActiveRecord::Migration[5.1]
  def change
    create_table :documents_status_changes do |t|
      t.belongs_to :user
      t.belongs_to :document
      t.string :status
      t.string :comment

      t.timestamps
    end
  end
end
