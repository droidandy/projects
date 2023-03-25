class CreatePermissions < ActiveRecord::Migration[5.1]
  def change
    create_table :permissions do |t|
      t.string :name
      t.string :slug

      t.timestamps
    end

    create_table :roles_permissions, id: false do |t|
      t.references :role
      t.references :permission
    end

    add_index :permissions, :slug
    add_index :roles_permissions, %i[role_id permission_id]
  end
end
