class ChangeMetadataDefaultValue < ActiveRecord::Migration[5.1]
  def change
    change_column :documents, :metadata, :jsonb, default: {}, null: false
  end
end
