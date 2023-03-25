Sequel.migration do
  up do
    create_enum :user_type, %w(User Member)

    alter_table :users do
      set_column_type :kind, 'user_type USING kind::user_type'
    end
  end

  down do
    alter_table :users do
      set_column_type :kind, String
    end

    drop_enum :user_type
  end
end
