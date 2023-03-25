Sequel.migration do
  up do
    from(:companies).where(booker_notifications: nil).update(booker_notifications: true)
    from(:companies).where(credit_rate_status: nil).update(credit_rate_status: 'na')

    alter_table(:companies) do
      set_column_not_null :booker_notifications
      set_column_not_null :credit_rate_status
    end
  end

  down do
    alter_table(:companies) do
      set_column_allow_null :booker_notifications
      set_column_allow_null :credit_rate_status
    end
  end
end
