module Addresses
  class PredefinedList < ApplicationService
    attributes :string

    def execute!
      PredefinedAddress.match(string).map do |addr|
        {
          type: 'Address',
          text: addr[:line],
          postal_code: addr[:postal_code],
          predefined: true
        }
      end
    end
  end
end
