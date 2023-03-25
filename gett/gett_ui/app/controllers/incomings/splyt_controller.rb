module Incomings
  class SplytController < AuthController
    def event
      service = Incomings::Splyt::EventHandler.new(params: event_params)

      if service.execute.success?
        head :ok
      else
        render json: { errors: service.errors }, status: :internal_server_error
      end
    end

    private def api_token
      request.headers['WH-Secret']
    end

    private def access_token
      Settings.splyt.access_token
    end

    private def event_params
      params.permit(event: [:name, :time], data: [:booking_id, :status]).to_h
    end
  end
end
