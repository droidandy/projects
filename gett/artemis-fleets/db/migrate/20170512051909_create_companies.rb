class CreateCompanies < ActiveRecord::Migration[5.1]
  def change
    create_table :companies do |t|
      t.string :name, null: false
      t.boolean :active, null: false, default: true
      t.string :logo
      t.belongs_to :salesman
      t.timestamps
    end
  end
end
