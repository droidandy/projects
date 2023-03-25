Sequel.migration do
  up do
    alter_table :company_signup_requests do
      add_column :user_name, String
      add_column :comment, String
    end

    DB[:company_signup_requests].update(user_name: Sequel.join([:first_name, ' ', :last_name]))

    alter_table :company_signup_requests do
      drop_column :estimated_costs
      drop_column :first_name
      drop_column :last_name
    end
  end

  down do
    alter_table :company_signup_requests do
      add_column :first_name, String
      add_column :last_name, String
      add_column :estimated_costs, Float
    end

    DB[:company_signup_requests].update(first_name: Sequel[:user_name])

    alter_table :company_signup_requests do
      drop_column :user_name
      drop_column :comment
    end
  end
end
