Sequel.migration do
  change do
    alter_table :company_infos do
      add_column :quote_price_increase_percentage, Float, null: false, default: 0
      add_column :quote_price_increase_pounds, Float, null: false, default: 0
    end
  end
end
