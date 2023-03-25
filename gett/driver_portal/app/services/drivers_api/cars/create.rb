module DriversApi
  module Cars
    class Create < ::DriversApi::Base
      attr_reader :car_id

      schema do
        required(:vehicle).filled
      end

      def execute!
        process_response do |body|
          @car_id = body['id']
        end
      end

      private def response
        @response ||= client.create_car(
          attributes: attributes
        )
      end

      private def attributes
        {
          license: vehicle.plate_number,
          model: vehicle.model,
          color: vehicle.color,
          active: true,
          env: 'uk'
        }
      end
    end
  end
end
