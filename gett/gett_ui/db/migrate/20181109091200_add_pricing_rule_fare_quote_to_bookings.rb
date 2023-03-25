Sequel.migration do
  change do
    add_column :bookings, :pricing_rule_fare_quote, Integer
  end
end
