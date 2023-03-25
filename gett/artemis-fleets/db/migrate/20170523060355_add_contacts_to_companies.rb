class AddContactsToCompanies < ActiveRecord::Migration[5.1]
  def change
    change_table :companies do |t|
      t.belongs_to :primary_contact
      t.belongs_to :billing_contact
    end
  end
end
