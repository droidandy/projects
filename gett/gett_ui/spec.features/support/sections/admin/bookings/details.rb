module Sections
  module Admin::Bookings
    class Details < SitePrism::Section
      element :edit_order, :button, 'Edit'
      element :repeat_booking, :button, 'Repeat'
      element :cancel_order, :button, 'Cancel'
      element :message, :button, 'Message'
      element :order_history, :button, 'Order history'
      element :export_time_line, :button, 'Export Timeline'
      element :comments, :button, 'Comments'
      element :payment_details, :button, 'Payment details'
      element :critical_flag, :button, 'Critical Flag'
      element :stop_points, :button, 'Stop points'
      element :resend_order, :button, 'Resend'

      element :passenger_name, :xpath, '//*[@data-name="passengerName"]'
      element :passenger_phone, :text_node, 'passengerPhone'
      element :booker_name, :xpath, '//a[@data-name="bookerName"]'
      element :booker_phone, :text_node, 'bookerPhone'
      element :vendor_name, :text_node, 'vendorName'
      element :vendor_phone, :text_node, 'vendorPhone'
      element :reason_for_travel, :text_node, 'travelReason'
      element :message_to_driver, :text_node, 'messageToDriver'
      element :references, :text_node, 'references'
      element :flight_number, :text_node, 'flightNumber'

      def comments_count
        comments.text.scan(/\d/).first.to_i
      end
    end
  end
end
