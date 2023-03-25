class AddStepToInvites < ActiveRecord::Migration[5.1]
  def change
    add_column :invites, :step, :integer, default: 0

    reversible do |dir|
      dir.up { execute 'update invites set step = 0' }
      dir.down { execute 'update invites set step = null' }
    end

    change_column :invites, :step, :integer, default: 0, null: false
  end
end
