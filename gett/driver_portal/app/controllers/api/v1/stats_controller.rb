module Api
  module V1
    class StatsController < ApplicationController
      before_action :authenticate_user!

      def index
        service = Drivers::Stats::Get.new(current_user, index_params)

        execute_and_process(service) do
          render json: UserStats::Show.new(service.stats).as_json
        end
      end

      def current
        service = Drivers::Stats::Get.new(current_user, current_params)

        execute_and_process(service) do
          render json: UserStats::Show.new(service.stats).as_json
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
