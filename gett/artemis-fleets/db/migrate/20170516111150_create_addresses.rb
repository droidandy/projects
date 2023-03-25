class CreateAddresses < ActiveRecord::Migration[5.1]
  def change
    create_table :addresses do |t|
      t.string :line
      t.string :postal_code
      t.float :lat
      t.float :lng
      t.timestamps
    end
  end
end
