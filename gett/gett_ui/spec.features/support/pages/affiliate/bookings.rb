module Pages
  module Affiliate
    class Bookings < Pages::Affiliate::Base
      set_url('/affiliate/bookings')
      element :company_name, :text_node, 'companyName'
      element :company_address, :text_node, 'companyAddress'

      section :book_asap, Sections::Checkbox, :ant_radio_button, 'bookAsap'
      section :pre_book, Sections::Checkbox, :ant_radio_button, 'preBook'

      element :date_picker, :date_picker, 'datePicker'
      section :time_picker, Sections::TimePicker, :id, 'timePickerContainer'

      section :as_directed, Sections::Checkbox, :checkbox, 'asDirected'
      section :pickup_address, Sections::Autocomplete, :combobox, 'pickupAddress'
      section :destination_address, Sections::Autocomplete, :combobox, 'destinationAddress'
      section :room, Sections::Input, :field, 'room'
      section :name, Sections::Input, :field, 'passengerName'
      section :phone, Sections::Phone, :phone, 'passengerPhone'
      section :message_to_driver, Sections::Input, :fillable_field, 'message'
      element :order_ride, :button, 'orderRide'

      section :bookings_list, :text_node, 'bookingsList' do
        sections :bookings, Sections::Affiliate::Booking, :text_node, 'booking'
      end

      section :ride_details, :text_node, 'rideDetailsPopup' do
        element :close_button, :text_node, 'closeRideDetails'
        element :oder_id, :text_node, 'orderId'
        element :status, :text_node, 'status'
        element :ride_type, :text_node, 'vehicleType'
        element :payment_method, :text_node, 'paymentMethod'
        element :pickup_time, :text_node, 'pickupTime'
        element :pickup_address, :text_node, 'pickupAddress'
        element :destination_address, :text_node, 'destinationAddress'
        element :name_and_phone, :text_node, 'nameAndPhone'
        element :message_to_driver, :text_node, 'messageToDriver'
      end
    end
  end
end
