class AddAvatarUrlToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :avatar_url, :string
    remove_column :users, :string, :string
  end
end
