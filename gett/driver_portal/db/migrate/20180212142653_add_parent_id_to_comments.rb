class AddParentIdToComments < ActiveRecord::Migration[5.1]
  def change
    add_reference :comments, :parent
  end
end
