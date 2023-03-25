class CreateRequests < ActiveRecord::Migration[5.1]
  def change
    create_table :requests do |t|
      t.string :request_class
      t.integer :fleet_id
      t.datetime :performed_at
    end
  end
end
