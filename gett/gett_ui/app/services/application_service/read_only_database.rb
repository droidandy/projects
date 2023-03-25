module ApplicationService::ReadOnlyDatabase
  ActiveTransactionError = Class.new(StandardError)

  def with_read_only_database
    # Replica can not be used in test env
    # because examples run in transactions.
    return yield if Rails.env.test?

    raise ActiveTransactionError if DB.in_transaction?

    DB.with_server(:read_only_replica) do
      yield
    end
  end
end
