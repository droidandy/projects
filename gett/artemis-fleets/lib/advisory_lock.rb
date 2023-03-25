class AdvisoryLock
  def initialize(key, wait: true)
    @key = key
    @wait = wait
  end

  RETRY_INTERVAL = 0.1

  def acquire
    loop do
      return true if ApplicationRecord.connection.select_value(query)
      return false unless @wait
      sleep(RETRY_INTERVAL)
    end
  end

  def query
    "SELECT pg_try_advisory_xact_lock(#{@key})"
  end
end
