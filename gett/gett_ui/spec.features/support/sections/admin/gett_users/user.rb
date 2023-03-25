module Sections
  module Admin::GettUsers
    class User < SitePrism::Section
      element :user_role, :xpath, './td[1]'
      element :user_name, :xpath, './td[2]'
      element :user_surname, :xpath, './td[3]'
      element :user_email, :xpath, './td[4]'
      element :user_actions, :xpath, './td[5]'

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
    end
  end
end
