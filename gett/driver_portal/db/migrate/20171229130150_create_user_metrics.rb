class CreateUserMetrics < ActiveRecord::Migration[5.1]
  def change
    create_table :user_metrics do |t|
      t.belongs_to :user
      t.float :rating, default: 0
      t.float :today_acceptance, default: 0
      t.float :week_acceptance, default: 0
      t.float :month_acceptance, default: 0
      t.float :total_acceptance, default: 0

      t.timestamps
    end

    reversible do |dir|
      dir.up do
        remove_column :users, :rating
        remove_column :users, :today_acceptance
        remove_column :users, :week_acceptance
        remove_column :users, :month_acceptance
        remove_column :users, :total_acceptance
      end

      dir.down do
        add_column :users, :rating, :float
        add_column :users, :today_acceptance, :float
        add_column :users, :week_acceptance, :float
        add_column :users, :month_acceptance, :float
        add_column :users, :total_acceptance, :float
      end
    end
  end
end
