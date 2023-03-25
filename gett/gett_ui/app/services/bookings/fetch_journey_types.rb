module Bookings
  class FetchJourneyTypes < ApplicationService
    attributes :company, :passenger

    def execute!
      return [] unless company.bbc?
      return Booking::BBC::JourneyType::ALL_TYPES if passenger&.bbc_full?

      [Booking::BBC::JourneyType::WW]
    end
  end
end
