module Sections
  module Admin::AllUsers
    class User < SitePrism::Section
      element :user_company, :xpath, './td[2]'
      element :user_type, :xpath, './td[3]'
      element :user_role, :xpath, './td[4]'
      element :user_name, :xpath, './td[5]'
      element :user_surname, :xpath, './td[6]'
      element :user_email, :xpath, './td[7]'
      element :user_vip, :xpath, './td[8]'
      element :user_last_login_time, :xpath, './td[9]'
      element :user_login_count, :xpath, './td[10]'
      element :actions, :xpath, './td[11]/div'
      section :actions_menu, :xpath, '//*[@role="menu"]' do
        element :edit, :menu_item, 'Edit'
        element :set_password, :menu_item, 'Set Password'
        element :comments, :menu_item, 'Comments'

        def comments_count
          comments.text.scan(/\d/).first.to_i
        end
      end
      section :details, Sections::Admin::AllUsers::Details, :xpath, './following-sibling::tr[1]//div[@data-name="passengerDetails"]'

      def name
        user_name.text
      end

      def surname
        user_surname.text
      end

      def email
        user_email.text
      end

      def role
        user_role.text
      end

      def open_details
        user_company.click unless expanded?
        wait_until_details_visible
      end

      def close_details
        user_company.click if expanded?
        wait_until_details_invisible
      end

      def expanded?
        next_row = root_element.first(:xpath, './following-sibling::tr[1]')
        next_row.present? && next_row[:class].include?('ant-table-expanded-row')
      end
    end
  end
end
