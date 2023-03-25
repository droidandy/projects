module Drivers
  module Fleet
    class List < ApplicationService
      DEFAULT_FIELDS = %i[id].freeze
      SUCCESS_CODE = 'SUCCESS'.freeze

      attr_reader :drivers

      schema do
        optional(:driver_ids).maybe(:array?)
        optional(:fields).maybe(:array?)
        optional(:page).maybe(:int?)
        optional(:per).maybe(:int?)
      end

      def execute!
        return unless raw_drivers

        @drivers = raw_drivers.map do |driver|
          Drivers::Fleet::Parser.new(driver).parse
        end
        success!
      end

      private def raw_drivers
        @raw_drivers ||= if response.success? && response.body['code'] == SUCCESS_CODE
                           response.body['results']
                         else
                           fail!(errors: { data: 'was not retrieved' })
                           nil
                         end
      end

      private def response
        @response ||= client.drivers(
          driver_ids: driver_ids,
          fields: DEFAULT_FIELDS + Array.wrap(fields),
          page: page,
          per: per
        )
      end

      private def client
        @client ||= GettFleetApi::Client.new
      end
    end
  end
end
