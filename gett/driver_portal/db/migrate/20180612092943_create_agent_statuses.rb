class CreateAgentStatuses < ActiveRecord::Migration[5.1]
  def change
    create_table :agent_statuses do |t|
      t.belongs_to :user, null: false
      t.integer :status, null: false
      t.boolean :current, null: false, default: true
      t.datetime :created_at, null: false
      t.datetime :ended_at
    end
  end
end
