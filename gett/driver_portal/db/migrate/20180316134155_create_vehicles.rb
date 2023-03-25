class CreateVehicles < ActiveRecord::Migration[5.1]
  def change
    create_table :vehicles do |t|
      t.references :user
      t.string :title
      t.string :model
      t.string :color
      t.string :plate_number
      t.boolean :is_current, default: false, null: false
      t.boolean :hidden, default: false, null: false

      t.timestamps
    end
  end
end
