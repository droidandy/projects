Sequel.migration do
  change do
    alter_table :company_infos do
      add_column :carey_cancellation_before_arrival_fee, Integer, null: false, default: 0
      add_column :carey_cancellation_after_arrival_fee,  Integer, null: false, default: 0
    end
  end
end
