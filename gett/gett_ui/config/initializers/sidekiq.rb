require 'sidekiq/valve_middleware'

Sidekiq.configure_server do |config|
  config.server_middleware do |chain|
    chain.add Sidekiq::ValveMiddleware,
      jobs: %w(OTBookingsStatusUpdater BookingsAlertsChecker),
      gc_start_count: 200
  end

  config.redis = ConnectionPool.new(size: Settings&.sidekiq&.server_connection_pool_size, &REDIS_CONNECTION)

  config.average_scheduled_poll_interval = Rails.env.production? ? 3 : 10
end

Sidekiq.configure_client do |config|
  config.redis = ConnectionPool.new(size: Settings&.sidekiq&.client_connection_pool_size, &REDIS_CONNECTION)
end
