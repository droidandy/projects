using Sequel::CoreRefinements

Sequel.migration do
  up do
    admin_role_id = from(:roles)[name: 'admin'][:id] unless from(:roles).empty?

    drop_view :orders, if_exists: true

    alter_table :users do
      add_column :first_name, String
      add_column :last_name, String
      add_column :avatar, String
      add_foreign_key :user_role_id, :roles
    end

    alter_table :members do
      add_foreign_key :member_role_id, :roles
    end

    from(:users, :members)
      .where(:members[:id] => :users[:id])
      .update(
        avatar: :members[:avatar],
        first_name: :members[:first_name],
        last_name: :members[:last_name]
      )

    from(:users)
      .where(first_name: nil)
      .update(first_name: 'Super', last_name: 'Admin', user_role_id: admin_role_id)

    from(:members).update(member_role_id: :role_id)

    alter_table :users do
      set_column_not_null :first_name
      set_column_not_null :last_name
    end

    alter_table :members do
      drop_column :first_name
      drop_column :last_name
      drop_column :avatar
      drop_column :role_id
      set_column_not_null :member_role_id
    end
  end

  down do
    drop_view :orders, if_exists: true

    alter_table :members do
      add_column :first_name, String
      add_column :last_name, String
      add_column :avatar, String
      add_foreign_key :role_id, :roles
    end

    from(:members, :users)
      .where(:members[:id] => :users[:id])
      .update(
        avatar: :users[:avatar],
        first_name: :users[:first_name],
        last_name: :users[:last_name]
      )

    from(:members).update(role_id: :member_role_id)

    alter_table :members do
      drop_column :member_role_id
      set_column_not_null :first_name
      set_column_not_null :last_name
      set_column_not_null :role_id
    end

    alter_table :users do
      drop_column :first_name
      drop_column :last_name
      drop_column :avatar
      drop_column :user_role_id
    end
  end
end
