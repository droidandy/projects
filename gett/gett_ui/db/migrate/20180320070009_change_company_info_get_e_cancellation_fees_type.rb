Sequel.migration do
  up do
    alter_table :company_infos do
      set_column_type :get_e_cancellation_before_arrival_fee, Integer
      set_column_type :get_e_cancellation_after_arrival_fee, Integer
    end
  end

  down do
    alter_table :company_infos do
      set_column_type :get_e_cancellation_before_arrival_fee, Float
      set_column_type :get_e_cancellation_after_arrival_fee, Float
    end
  end
end
