module Pages
  module App::Passengers
    class Edit < Pages::App::Passengers::Form
      set_url('/passengers/{id}/edit')

      load_validation do
        [first_name.value.present?, 'User data is not loaded']
      end

      section :delete_modal, Sections::DeleteModal, '.ant-modal-content'

      # Personal Information Tab
      element :passenger_information_tab, :xpath, '//div[@role="tab" and .="Passenger Information"]'
      section :allow_personal_card_usage, Sections::Switcher, :switcher, 'allowPersonalCardUsage'
      section :warning, Sections::Warning, :xpath, "//*[contains(concat(' ', normalize-space(@class), ' '), ' ant-alert-warning ')]"
      element :reinvite_button, :button, 'Reinvite'

      def submit
        save_button.click
      end

      # Favourite Addresses Tab
      element :favourite_addresses_tab, :xpath, '//div[@role="tab" and .="Favourite Addresses"]'
      element :add_favourite_address_button, :button, 'Add address'
      sections :favourite_address, Sections::App::Passengers::FavouriteAddress, 'div.ant-tabs-tabpane-active .ant-table-row-level-0'
      section :favourite_address_modal, '.ant-modal-content' do
        section :address_name, Sections::Input, :field, 'name'
        section :address, Sections::Autocomplete, :combobox, 'address'
        section :pickup_message, Sections::Input, :field, 'pickupMessage'
        section :destination_message, Sections::Input, :field, 'destinationMessage'
        element :cancel_button, :button, 'Cancel'
        element :save_button, :button, 'Save'
      end

      def get_favourite_address_by_name(name)
        wait_until_true do
          favourite_address.find{ |fa| fa.name == name }
        end
      end

      # Payment Cards Tab
      element :payment_cards_tab, :xpath, '//div[@role="tab" and .="Payment Cards"]'
      element :add_payment_card_button, :button, 'Add card'
      sections :payment_card, Sections::App::Passengers::PaymentCard, 'div.ant-tabs-tabpane-active .ant-table-row-level-0'
      section :payment_card_modal, '.ant-modal-content' do
        section :card_type, Sections::Combobox, :combobox, 'kind'
        class CardDetailsModal < Pages::Base
          section :card_number, Sections::Input, '#pan'
          section :cvv, Sections::Input, '#cvv'
          section :expiration_date, Sections::Input, '#expiration_date'
        end
        iframe :card_details, CardDetailsModal, '#zoozIframe'
        section :card_holder, Sections::Input, :field, 'holderName'
        element :error, '.ant-alert-error'

        def populate(params = {})
          data = {
            type: 'Personal',
            number: Faker::Lorem.characters(16),
            cvv: '123',
            expiration_date: "01/#{2.years.from_now.year.to_s[-2..-1]}",
            cardholder: 'Ivanov Ivan'
          }.merge(params)

          card_type.set data[:type]
          card_holder.set data[:cardholder]
          card_details do |details|
            details.card_number.set data[:number]
            details.expiration_date.set data[:expiration_date]
            details.cvv.set data[:cvv]
          end
        end
        element :cancel_button, :button, 'Cancel'
        element :save_button, :button, 'Save'
      end

      def first_personal_card
        payment_card.find { |pc| pc.type.text == 'Personal' }
      end

      def first_business_card
        payment_card.find { |pc| pc.type.text == 'Business' }
      end

      # Advanced Options Tab
      element :advanced_options_tab, :xpath, '//div[@role="tab" and .="Advanced Options"]'
      section :default_car_type_selector, Sections::CarTypesRadioList, :xpath, '//div[./div[.="Default car type"]]'

      def select_default_car_type(car_type)
        default_car_type_selector.send(car_type).click
      end

      # Change Log Tab
      element :change_log_tab, :xpath, '//div[@role="tab" and .="Change Log"]'
      sections :change_logs, 'div.ant-tabs-tabpane-active .ant-table-row-level-0' do
        element :field_name, :xpath, './/td[1]'
        element :author, :xpath, './/td[2]'
        element :from, :xpath, './/td[3]'
        element :to, :xpath, './/td[4]'
      end

      def change_log_by_field_name(text)
        change_logs.find { |cl| cl.field_name.text == text }
      end

      # BBC Only
      element :passenger_declaration, :text_node, 'passengerDeclaration'
      section :accept_declaration, Sections::Switcher, :switcher, 'customAttributes.pdAccepted'
      element :pd_expiry_date, :text_node, 'pdExpiryDate'
      section :excess_mileage, Sections::Input, :field, 'customAttributes.allowedExcessMileage'
    end
  end
end
