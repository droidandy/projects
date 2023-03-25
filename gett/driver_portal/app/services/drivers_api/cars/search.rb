module DriversApi
  module Cars
    class Search < ::DriversApi::Base
      attr_reader :car_id

      schema do
        required(:license).filled(:str?)
      end

      def execute!
        process_response do |body|
          cars = Array.wrap(body)
          @car_id = cars.first['id'] if cars.any?
        end
      end

      private def response
        @response ||= begin
          client.search_car(
            license: license
          )
        end
      end
    end
  end
end
