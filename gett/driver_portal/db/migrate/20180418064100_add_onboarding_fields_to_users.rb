class AddOnboardingFieldsToUsers < ActiveRecord::Migration[5.1]
  def change
    change_table :users do |t|
      t.integer :onboarding_step, null: false, default: 0
      t.datetime :onboarding_failed_at
      t.boolean :rides_threshold, null: false, default: false
      t.decimal :other_rating, precision: 3, scale: 2
      t.integer :vehicle_reg_year
      t.string :bank_sort_code
      t.string :bank_account_number
      t.string :insurance_number
      t.boolean :insurance_number_agreement, null: false, default: false
      t.boolean :documents_agreement, null: false, default: false
      t.boolean :appointment_scheduled, null: false, default: false
      t.boolean :documents_uploaded, null: false, default: false
    end
  end
end
