Sequel.migration do
  up do
    set_column_type :payment_cards, :last_4, String

    DB[:payment_cards] # ensure current last_4's have at least 4 digits
      .where{ Sequel.function(:length, last_4) < 4 }
      .update(last_4: Sequel.function(:lpad, :last_4, 4, '0'))
  end

  down do
    alter_table :payment_cards do
      set_column_type :last_4, 'Integer USING last_4::integer'
    end
  end
end
