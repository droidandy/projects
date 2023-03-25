module Sections
  module App::Passengers
    class PaymentCard < SitePrism::Section
      element :default, :xpath, './td[1]'
      element :type, :xpath, './td[2]'
      element :holder_name, :xpath, './td[3]'
      element :last_4, :xpath, './td[4]'
      element :expiration_date, :xpath, './td[5]'
      section :actions, :xpath, './td[6]' do
        element :deactivate_button, 'button'
        element :status, 'div'
      end

      def make_default
        default.first(:xpath, './/button').click
      end

      def default?
        default.text == 'Default'
      end
    end
  end
end
