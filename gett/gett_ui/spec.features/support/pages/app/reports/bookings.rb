module Pages
  module App::Reports
    class Bookings < Pages::App::Base
      set_url('/reports/bookings')
      include Mixings::Spinnable::Loader

      sections :bookings, Sections::App::Bookings::Booking, '.ant-table-row-level-0'
      element :export_button, :button, 'Export'
    end
  end
end
