module DriversApi
  module Documents
    class Create < ApplicationService
      attr_reader :document_id

      schema do
        required(:document).filled
      end

      def execute!
        if response.success?
          @document_id = response.body['id']
          success!
        else
          fail!(errors: { base: response.body['error'] })
        end
      end

      private def response
        @response ||= begin
          client.create_document(
            driver_id: document.user.gett_id,
            car_id: document.vehicle.try(:gett_id),
            attributes: attributes
          )
        end
      end

      private def attributes
        {
          expiration_time: (document.expires_at || 99.years.from_now).iso8601,
          start_time: document.started_at,
          document_type: document.kind.slug,
          document_id: document.unique_id
        }
      end

      private def client
        @client ||= GettDriversApi::Client.new
      end
    end
  end
end
