class ChangeDocumentsExpirationToDate < ActiveRecord::Migration[5.1]
  def change
    add_column :documents, :expiry_date, :date

    reversible do |dir|
      dir.up { execute 'UPDATE documents SET expiry_date = expires_at' }
      dir.down { execute 'UPDATE documents SET expires_at = expiry_date' }
    end

    remove_column :documents, :expires_at, :datetime
  end
end
