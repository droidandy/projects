class CreateLogins < ActiveRecord::Migration[5.1]
  def change
    create_table :logins do |t|
      t.belongs_to :user

      t.timestamps
    end
  end
end
