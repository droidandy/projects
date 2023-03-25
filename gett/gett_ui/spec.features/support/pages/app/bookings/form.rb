module Pages
  module App::Bookings
    class Form < Pages::App::Base
      include Pages::Shared::BookingForm

      def submit
        save_button.click
      end
    end
  end
end
