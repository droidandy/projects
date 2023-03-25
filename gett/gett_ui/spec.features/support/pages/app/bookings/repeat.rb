module Pages
  module App::Bookings
    class Repeat < Pages::App::Bookings::Form
      set_url('/bookings/{order}/repeat')
    end
  end
end
