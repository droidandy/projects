module Api
  module V1
    class MetricsController < ApplicationController
      before_action :authenticate_user!

      def index
        service = Drivers::Fleet::Metrics.new(current_user, index_params)

        execute_and_process(service) do
          render json: UserMetrics::Show.new(service.driver_data).as_json
        end
      end

      def current
        service = Drivers::Fleet::Metrics.new(current_user, current_params)

        execute_and_process(service) do
          render json: UserMetrics::Show.new(service.driver_data).as_json
        end
      end

      private def index_params
        {
          user_id: params[:id]
        }
      end

      private def current_params
        {
          user_id: current_user.id
        }
      end
    end
  end
end
