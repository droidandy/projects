class AddApproverIdToUsers < ActiveRecord::Migration[5.1]
  def change
    add_reference :users, :approver
  end
end
