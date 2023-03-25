Sequel.migration do
  change do
    add_column :payment_cards, :default, :boolean, null: false, default: false
  end
end
