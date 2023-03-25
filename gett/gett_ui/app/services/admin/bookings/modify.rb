module Admin::Bookings
  class Modify < ::Bookings::Modify
    def self.policy_class
      Admin::Policy
    end

    def show_result
      Admin::Bookings::Show.new(booking: booking).execute.result
    end
  end
end
