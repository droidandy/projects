Sequel.migration do
  change do
    alter_table :members do
      add_column :payroll, String
      add_column :cost_centre, String
      add_column :division, String
    end
  end
end
