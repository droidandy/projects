class AddResetPasswordDigestToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :reset_password_digest, :string
    add_index :users, :reset_password_digest
  end
end
