Sequel.migration do
  change do
    alter_table :companies do
      add_column :payroll_required, 'Boolean', default: false
      add_column :cost_centre_required, 'Boolean', default: false
    end
  end
end
