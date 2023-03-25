module Drivers
  module Fleet
    class UpdateParser
      attr_reader :data

      def initialize(data)
        @data = data
      end

      def parse
        {
          account_number: data['account_number'],
          address:        data['postal_address'],
          birth_date:     data['birthdate'],
          email:          data['email'],
          name:           data['name'],
          phone:          data['phone'].to_s,
          postcode:       data['zip'],
          sort_code:      data['sort_code'],
          vehicle_colour: data['color'] || data['color_en']
        }
      end
    end
  end
end
