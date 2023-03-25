module Sections
  module App::Passengers
    class Passenger < SitePrism::Section
      element :expand_icon, :xpath, './td[1]/span', visible: false
      element :avatar, :xpath, './td[2]'
      element :passenger_name, :xpath, './td[3]'
      element :passenger_surname, :xpath, './td[4]'
      element :passenger_phone, :xpath, './td[5]'
      element :passenger_email, :xpath, './td[6]'
      section :details, Sections::App::Passengers::Details, :xpath, './following-sibling::tr[1]//div[@data-name="passengerDetails"]'

      def name
        passenger_name.text
      end

      def surname
        passenger_surname.text
      end

      def phone_number
        passenger_phone.text.delete('^+0-9')
      end

      def email
        passenger_email.text
      end

      def open_details
        avatar.click unless expanded?
        wait_until_details_visible
      end

      def close_details
        avatar.click if expanded?
        wait_until_details_invisible
      end

      def expanded?
        next_row = root_element.first(:xpath, './following-sibling::tr[1]')
        next_row.present? && next_row[:class].include?('ant-table-expanded-row')
      end

      def has_avatar? # rubocop:disable Naming/PredicateName
        avatar.first(:xpath, './/img').present?
      end
    end
  end
end
