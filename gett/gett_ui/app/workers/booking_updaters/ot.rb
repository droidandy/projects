module BookingUpdaters
  class OT < Base
    INTERVAL = 10.seconds.freeze

    sidekiq_options queue: :ot, retry: false
  end
end
