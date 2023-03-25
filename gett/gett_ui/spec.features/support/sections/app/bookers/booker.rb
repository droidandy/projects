module Sections
  module App::Bookers
    class Booker < SitePrism::Section
      element :expand_icon, :xpath, './td[1]/span', visible: false
      element :booker_name, :xpath, './td[2]'
      element :booker_surname, :xpath, './td[3]'
      element :booker_role, :xpath, './td[4]'
      element :booker_phone, :xpath, './td[5]'
      element :booker_email, :xpath, './td[6]'
      section :details, Sections::App::Bookers::Details, :xpath, './following-sibling::tr[1]//div[@data-name="bookerDetails"]'

      def name
        booker_name.text
      end

      def surname
        booker_surname.text
      end

      def phone_number
        booker_phone.text.delete('^+0-9')
      end

      def email
        booker_email.text
      end

      def role
        booker_role.text
      end

      def open_details
        booker_name.click unless expanded?
        wait_until_details_visible
      end

      def close_details
        booker_name.click if expanded?
        wait_until_details_invisible
      end

      def expanded?
        next_row = root_element.first(:xpath, './following-sibling::tr[1]')
        return false unless next_row

        next_row[:class].include?('ant-table-expanded-row')
      end
    end
  end
end
