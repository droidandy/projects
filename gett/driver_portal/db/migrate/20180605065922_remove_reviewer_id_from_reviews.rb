class RemoveReviewerIdFromReviews < ActiveRecord::Migration[5.1]
  def change
    remove_column :reviews, :reviewer_id, :integer
  end
end
