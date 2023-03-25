module Sections
  module App::Bookings
    class Booking < Sections::Common::Bookings::Booking
      section :details, Sections::App::Bookings::Details, :xpath, './following-sibling::tr[1]//div[@data-name="bookingDetails"]'
    end
  end
end
