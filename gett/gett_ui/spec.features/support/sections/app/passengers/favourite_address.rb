module Sections
  module App::Passengers
    class FavouriteAddress < SitePrism::Section
      element :address_name, :xpath, './td[1]'
      element :address, :xpath, './td[2]'
      element :pickup_message, :xpath, './td[3]'
      element :destination_message, :xpath, './td[4]'
      element :edit_button, :button, 'Edit'
      element :delete_button, :button, 'Delete'

      def name
        address_name.text
      end
    end
  end
end
