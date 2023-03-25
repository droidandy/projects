module BookingUpdaters
  class Gett < Base
    INTERVAL = 1.second.freeze

    sidekiq_options queue: :gett, retry: false
  end
end
