class AddHowDidYouHearAboutToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :how_did_you_hear_about, :string
  end
end
