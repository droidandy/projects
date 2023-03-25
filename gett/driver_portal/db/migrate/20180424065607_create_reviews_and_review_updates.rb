class CreateReviewsAndReviewUpdates < ActiveRecord::Migration[5.1]
  def change
    create_table :reviews do |t|
      t.belongs_to :driver, null: false
      t.belongs_to :reviewer

      t.boolean :completed
      t.text :comment

      t.boolean :language_check
      t.text :language_check_comment

      t.boolean :training_completed
      t.text :training_completed_comment

      t.boolean :attitude_competence
      t.text :attitude_competence_comment

      t.boolean :vehicle_check
      t.text :vehicle_check_comment

      t.boolean :phone_contract
      t.text :phone_contract_comment

      t.timestamps
    end

    create_table :review_updates do |t|
      t.belongs_to :review, null: false
      t.belongs_to :reviewer, null: false

      t.integer :requirement, null: false
      t.boolean :completed
      t.text :comment

      t.timestamps
    end

    add_column :users, :gett_phone, :string
  end
end
