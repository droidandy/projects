Sequel.migration do
  up do
    create_table :work_roles do
      primary_key :id
      foreign_key :company_id, :companies, null: false
      String :name, null: false

      timestamps
    end

    create_table :departments do
      primary_key :id
      foreign_key :company_id, :companies, null: false
      String :name, null: false

      timestamps
    end

    alter_table :bookers do
      drop_column :reference
      drop_column :work
      drop_column :division
      drop_column :department
      add_foreign_key :work_role_id, :work_roles
      add_foreign_key :department_id, :departments
    end
  end

  down do
    alter_table :bookers do
      add_column :reference, String
      add_column :work, String
      add_column :division, String
      add_column :department, String
      drop_column :work_role_id
      drop_column :department_id
    end

    drop_table :work_roles
    drop_table :departments
  end
end
