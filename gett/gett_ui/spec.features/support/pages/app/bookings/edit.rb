module Pages
  module App::Bookings
    class Edit < Pages::App::Bookings::Form
      set_url('/bookings/{order}/edit')
    end
  end
end
