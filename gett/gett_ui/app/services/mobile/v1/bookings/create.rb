module Mobile::V1
  module Bookings
    class Create < ::Bookings::Create
      def self.policy_class
        ::Bookings::CreatePolicy
      end

      private def show_service
        Mobile::V1::Bookings::Show.new(booking: result)
      end

      private def source_type
        ::Booking::SourceType::MOBILE_APP
      end
    end
  end
end
