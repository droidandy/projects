class AddExpiresAtToDocuments < ActiveRecord::Migration[5.1]
  def change
    add_column :documents, :expires_at, :datetime

    reversible do |dir|
      dir.up { execute 'UPDATE documents SET expires_at = expiry_date' }
      dir.down { execute 'UPDATE documents SET expiry_date = expires_at' }
    end

    remove_column :documents, :expiry_date, :date
  end
end
