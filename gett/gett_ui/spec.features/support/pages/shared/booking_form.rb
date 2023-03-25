module Pages
  module Shared
    module BookingForm
      def self.included(mod)
        mod.module_eval do
          include Mixings::Spinnable::Loader
          section :warning, Sections::Warning, :xpath, "//*[contains(concat(' ', normalize-space(@class), ' '), ' ant-alert ')]"

          section :passenger_name, Sections::Autocomplete, :combobox, 'passengerName'
          section :phone_number, Sections::Phone, :phone, 'passengerPhone'
          section :i_am_passenger, Sections::Checkbox, :checkbox, 'i_am_passenger'
          section :international, Sections::Checkbox, :checkbox, 'internationalFlag'
          section :as_directed, Sections::Checkbox, :checkbox, 'asDirected'

          element :home_to_work_button, :button, 'HomeWork'
          element :work_to_home_button, :button, 'WorkHome'

          section :pickup_address, Sections::Autocomplete, :combobox, 'pickupAddress'
          element :pickup_favourite_address_icon, :text_node, 'pickupAddressFavorIcon'
          element :pickup_office_location_icon, :text_node, 'pickupAddressLocationsIcon'

          section :destination_address, Sections::Autocomplete, :combobox, 'destinationAddress'
          element :destination_favourite_address_icon, :text_node, 'destinationAddressFavorIcon'
          element :destination_office_location_icon, :text_node, 'destinationAddressLocationsIcon'

          section :journey_type, Sections::Combobox, :combobox, 'journeyType'
          element :add_stop_point, :text_node, 'addStopPoint'

          sections :stop_points, :text_node, 'stopPointForm' do
            section :i_am_passenger, Sections::Checkbox, :checkbox, 'iAmPassenger'
            section :same_passenger_as_for_main_booking, Sections::Checkbox, :checkbox, 'samePassengerAsForMainBooking'
            section :name, Sections::Autocomplete, :combobox, 'name'
            section :phone, Sections::Phone, :phone, 'phone'
            section :address, Sections::Autocomplete, :combobox, 'address'
            element :remove_button, :text_node, 'removePoint'
          end

          section :schedule_for_now, Sections::Checkbox, :ant_radio_button, 'scheduleForNow'
          section :schedule_for_later, Sections::Checkbox, :ant_radio_button, 'scheduleForLater'
          section :schedule_recurring, Sections::Checkbox, :ant_radio_button, 'scheduleForLater'

          section :number_of_required_taxi, Sections::Combobox, :combobox, 'vehicleCount'
          section :calendar, Sections::Combobox, :combobox, 'datePickerContainer'
          section :time_picker, Sections::Combobox, :combobox, 'timePickerContainer'

          section :vehicles, Sections::BookingCarTypesList, :text_node, 'vehicleName'

          section :payment_method, Sections::Combobox, :combobox, 'paymentType'
          section :message_to_driver, Sections::Input, :fillable_field, 'message'
          section :reason_for_travel, Sections::Combobox, :combobox, 'travelReasonId'

          section :flight_number, Sections::Input, :field, 'flight'
          element :verify_flight_number_button, :button, 'flightVerify'
          element :flight_stats, :text_node, 'flightStats'

          sections :references, :xpath, '//*[@data-name="bookingReferences"]//div[./label]' do
            element :name, :xpath, './descendant::label'
            element :cost_centre_link, :xpath, './/a'
            section :field, Sections::Input, :xpath, './/input'
            section :dropdown, Sections::Autocomplete, :xpath, './/div[@role="combobox"]'
          end

          element :continue_button, :button, 'Continue'
          element :save_button, :button, 'saveOrder'
          element :cancel_button, :button, 'cancel'
        end
      end
    end
  end
end
