Sequel.migration do
  up do
    alter_table :booking_charges do
      add_column :free_waiting_time, Integer, default: 0
      add_column :paid_waiting_time, Integer, default: 0
    end

    DB[:booking_charges].update(free_waiting_time:
      Sequel.function(:substr, :free_waiting_time_text, 1, 2).cast(:integer) * 3600 +
      Sequel.function(:substr, :free_waiting_time_text, 4, 2).cast(:integer) * 60 +
      Sequel.function(:substr, :free_waiting_time_text, 7, 2).cast(:integer)
    )

    DB[:booking_charges].update(paid_waiting_time:
      Sequel.function(:substr, :paid_waiting_time_text, 1, 2).cast(:integer) * 3600 +
      Sequel.function(:substr, :paid_waiting_time_text, 4, 2).cast(:integer) * 60 +
      Sequel.function(:substr, :paid_waiting_time_text, 7, 2).cast(:integer)
    )

    alter_table :booking_charges do
      drop_column :free_waiting_time_text
      drop_column :paid_waiting_time_text
    end
  end

  down do
    alter_table :booking_charges do
      add_column :free_waiting_time_text, String
      add_column :paid_waiting_time_text, String
    end

    DB[:booking_charges].update(free_waiting_time_text: Sequel.join([
      Sequel.function(:lpad, (Sequel[:free_waiting_time] / 3600).cast(:text), 2, '0'),
      ':',
      Sequel.function(:lpad, (Sequel.function(:mod, :free_waiting_time, 3600) / 60).cast(:text), 2, '0'),
      ':',
      Sequel.function(:lpad, Sequel.function(:mod, :free_waiting_time, 60).cast(:text), 2, '0')
    ]))

    DB[:booking_charges].update(paid_waiting_time_text: Sequel.join([
      Sequel.function(:lpad, (Sequel[:paid_waiting_time] / 3600).cast(:text), 2, '0'),
      ':',
      Sequel.function(:lpad, (Sequel.function(:mod, :paid_waiting_time, 3600) / 60).cast(:text), 2, '0'),
      ':',
      Sequel.function(:lpad, Sequel.function(:mod, :paid_waiting_time, 60).cast(:text), 2, '0')
    ]))

    alter_table :booking_charges do
      drop_column :free_waiting_time
      drop_column :paid_waiting_time
    end
  end
end
