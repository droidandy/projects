module DriversApi
  module Drivers
    class Create < ::DriversApi::Base
      DRIVER_TYPE = 'apollo'.freeze

      attr_reader :driver_id

      schema do
        required(:user).filled
      end

      def execute!
        process_response do |body|
          @driver_id = body['id']
        end
      end

      private def response
        @response ||= client.create_driver(
          attributes: attributes
        )
      end

      private def attributes
        {
          display_name: user.name,
          driver_type: DRIVER_TYPE,
          name: user.name,
          phone: user.phone
        }
      end
    end
  end
end
