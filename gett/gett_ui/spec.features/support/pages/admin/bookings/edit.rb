module Pages
  module Admin::Bookings
    class Edit < Pages::Admin::Bookings::Form
      set_url('/admin/bookings/{order}/edit')
    end
  end
end
