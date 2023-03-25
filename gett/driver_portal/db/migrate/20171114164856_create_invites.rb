class CreateInvites < ActiveRecord::Migration[5.1]
  def change
    create_table :invites do |t|
      t.belongs_to :user
      t.belongs_to :sender
      t.datetime :accepted_at
      t.datetime :expires_at
      t.string :token_digest, null: false
      t.timestamps
    end

    add_index :invites, :token_digest, unique: true
  end
end
