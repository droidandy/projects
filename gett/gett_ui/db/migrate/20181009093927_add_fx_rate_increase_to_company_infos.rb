Sequel.migration do
  change do
    alter_table :company_infos do
      add_column :system_fx_rate_increase_percentage, Float, null: false, default: 0
    end
  end
end
