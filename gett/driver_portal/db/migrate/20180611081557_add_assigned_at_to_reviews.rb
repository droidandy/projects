class AddAssignedAtToReviews < ActiveRecord::Migration[5.1]
  def change
    add_column :reviews, :assigned_at, :datetime
  end
end
