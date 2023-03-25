using Sequel::CoreRefinements

Sequel.migration do
  up do
    create_table :booking_charges do
      primary_key :id
      foreign_key :booking_id, :bookings, null: false
      Integer :fare_cost, null: false, default: 0
      Integer :handling_fee, null: false, default: 0
      Integer :booking_fee, null: false, default: 0
      String :free_waiting_time_text
      String :paid_waiting_time_text
      Integer :paid_waiting_time_fee, null: false, default: 0
      String :stops_text
      Integer :stops_fee, null: false, default: 0
      Integer :extra_fees, null: false, default: 0
      Integer :phone_booking_fee, null: false, default: 0
      Integer :tips, null: false, default: 0
      Integer :vat, null: false, default: 0
      Integer :total_cost, null: false, default: 0

      timestamps
    end

    drop_view :orders, if_exists: true

    alter_table :bookings do
      rename_column :cost_excl_fee, :ot_fare_quote
      drop_column :cost_incl_fee
    end
  end

  down do
    drop_view :orders, if_exists: true

    drop_table :booking_charges

    alter_table :bookings do
      rename_column :ot_fare_quote, :cost_excl_fee
      add_column :cost_incl_fee, Integer, null: false, default: 0
    end
  end
end
