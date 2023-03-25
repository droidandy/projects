class AddIdentityCheckedAtToReviews < ActiveRecord::Migration[5.1]
  def change
    add_column :reviews, :identity_checked_at, :datetime
  end
end
