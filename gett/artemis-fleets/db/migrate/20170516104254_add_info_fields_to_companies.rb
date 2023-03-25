class AddInfoFieldsToCompanies < ActiveRecord::Migration[5.1]
  def change
    change_table :companies do |t|
      t.string :vat_number
      t.string :cost_centre
      t.string :legal_name
      t.belongs_to :address
      t.belongs_to :legal_address
      t.integer :fleet_id
    end
  end
end
