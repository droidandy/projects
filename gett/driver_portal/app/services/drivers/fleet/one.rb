module Drivers
  module Fleet
    class One < ApplicationService
      DEFAULT_FIELDS = %i[id].freeze

      attr_reader :driver

      schema do
        required(:driver_id).filled(:int?)
        optional(:fields).maybe(:array?)
      end

      def execute!
        return unless raw_driver

        @driver = Drivers::Fleet::Parser.new(raw_driver).parse
        success!
      end

      private def raw_driver
        @raw_driver ||= if response.success?
                          response.result
                        else
                          fail!(errors: { data: 'was not retrieved' })
                          nil
                        end
      end

      private def response
        @response ||= client.driver(
          driver_id: driver_id,
          fields: DEFAULT_FIELDS + Array.wrap(fields)
        )
      end

      private def client
        @client ||= GettFleetApi::Client.new
      end
    end
  end
end
