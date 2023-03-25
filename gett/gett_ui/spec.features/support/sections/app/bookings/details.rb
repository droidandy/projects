module Sections
  module App::Bookings
    class Details < SitePrism::Section
      element :passenger_name, :text_node, 'passengerName'
      element :passenger_phone, :text_node, 'passengerPhone'

      element :booker_name, :text_node, 'bookerName'
      element :booker_phone, :text_node, 'bookerPhone'

      section :journey, '[class *= "journeyPath"]' do
        elements :stop_points, '[class *= "journeyPoint"]'

        def pickup_address
          stop_points.first
        end

        def destination_address
          stop_points.last
        end
      end

      element :reason_for_travel, :text_node, 'travelReason'
      element :message_to_driver, :text_node, 'messageToDriver'

      element :references, :text_node, 'references'
      element :flight_number, :text_node, 'flightNumber'
      element :service_feedback, :button, 'Feedback'
      element :edit_order, :button, 'Edit'
      element :cancel_order, :button, 'Cancel'
      element :export_time_line, :button, 'Export Timeline'
      element :repeat_booking, :button, 'Repeat'
      element :stop_points, :button, 'Stop points'
    end
  end
end
