class AddProfileFiledsToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :hobbies, :string
    add_column :users, :talking_topics, :string
    add_column :users, :driving_cab_since, :date
    add_column :users, :disability_type, :string
    add_column :users, :disability_description, :string
  end
end
