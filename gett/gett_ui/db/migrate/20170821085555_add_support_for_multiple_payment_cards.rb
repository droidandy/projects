Sequel.migration do
  change do
    alter_table :payment_cards do
      add_column :personal, :boolean, null: false, default: true
    end

    alter_table :bookings do
      add_foreign_key :payment_card_id, :payment_cards, null: true
    end
  end
end
