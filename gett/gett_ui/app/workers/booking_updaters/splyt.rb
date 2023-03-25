module BookingUpdaters
  class Splyt < Base
    sidekiq_options queue: :splyt, retry: false
  end
end
