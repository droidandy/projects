module Pages
  module Admin::Bookings
    class Repeat < Pages::Admin::Bookings::Form
      set_url('/admin/bookings/{order}/repeat')
    end
  end
end
