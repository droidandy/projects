class AddMemberFieldsToUsers < ActiveRecord::Migration[5.1]
  def change
    change_table :users do |t|
      t.remove :kind
      t.string :type
      t.belongs_to :company
      t.boolean :active, default: true, null: false
      t.string :first_name
      t.string :last_name
      t.string :phone
      t.string :mobile
      t.string :avatar
    end
  end
end
