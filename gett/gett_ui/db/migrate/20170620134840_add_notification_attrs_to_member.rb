Sequel.migration do
  up do
    alter_table :members do
      add_column :notify_with_sms, :boolean, default: false
      add_column :notify_with_email, :boolean, default: false
    end

    from(:members).update(notify_with_sms: true, notify_with_email: true)
  end

  down do
    alter_table :members do
      remove_column :notify_with_sms
      remove_column :notify_with_email
    end
  end
end
