class NormalizeReviews < ActiveRecord::Migration[5.1]
  def change
    remove_column :reviews, :language_check, :boolean
    remove_column :reviews, :language_check_comment, :text
    remove_column :reviews, :training_completed, :boolean
    remove_column :reviews, :training_completed_comment, :text
    remove_column :reviews, :attitude_competence, :boolean
    remove_column :reviews, :attitude_competence_comment, :text
    remove_column :reviews, :vehicle_check, :boolean
    remove_column :reviews, :vehicle_check_comment, :text
    remove_column :reviews, :phone_contract, :boolean
    remove_column :reviews, :phone_contract_comment, :text

    change_table :reviews do |t|
      t.integer :attempt_number, null: false, default: 1
      t.timestamp :scheduled_at
      t.timestamp :checkin_at
      t.timestamp :training_start_at
      t.timestamp :training_end_at
    end

    change_table :review_updates do |t|
      t.boolean :current, null: false, default: true
    end
  end
end
