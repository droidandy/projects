module Incomings
  class CareyController < AuthController
    skip_before_action :authenticate, only: :trip_status

    def trip_status
      if Incomings::Carey::StatusUpdateHandler.new(payload: payload).execute.success?
        render json: success_response
      else
        head :bad_request
      end
    end

    def outbound_expense
      if Incomings::Carey::PriceUpdateHandler.new(payload: payload).execute.success?
        render json: success_response
      else
        head :bad_request
      end
    end

    private def api_token
      request.headers[:api_key]
    end

    private def access_token
      Settings.carey.access_token
    end

    private def payload
      params.permit!.except(:controller, :action).to_h.with_indifferent_access
    end

    private def success_response
      {
        code: '200',
        message: 'Update received successfully'
      }
    end

    private def error_response
      {
        code: '401',
        message: 'Unauthorized'
      }
    end
  end
end
