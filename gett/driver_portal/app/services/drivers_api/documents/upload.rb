module DriversApi
  module Documents
    class Upload < ApplicationService
      schema do
        required(:document).filled
      end

      def execute!
        if response.success?
          success!
        else
          fail!(errors: { base: response.body['error'] })
        end
      end

      private def response
        @response ||= begin
          client.document_upload(
            driver_id: document.user.gett_id,
            car_id: document.vehicle.try(:gett_id),
            document_id: document.gett_id,
            file: document.file,
            content_type: document.content_type
          )
        end
      end

      private def client
        @client ||= GettDriversApi::Client.new
      end
    end
  end
end
