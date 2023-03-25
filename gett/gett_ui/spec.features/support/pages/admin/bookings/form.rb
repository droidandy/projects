module Pages
  module Admin::Bookings
    class Form < Pages::Admin::Base
      include Pages::Shared::BookingForm

      def submit
        save_button.click
      end
    end
  end
end
