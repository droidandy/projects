module Api
  module V1
    class OrdersController < ApplicationController
      before_action :authenticate_user!

      def show
        service = Orders::Get.new(current_user, show_params)

        execute_and_process(service) do
          render json: Orders::Show.new(service.order).as_json
        end
      end

      def distance
        service = Orders::TotalDistance.new(current_user, distance_params)

        execute_and_process(service) do
          render json: { distance: service.distance }
        end
      end

      def current_distance
        service = Orders::TotalDistance.new(current_user, current_distance_params)

        execute_and_process(service) do
          render json: { distance: service.distance }
        end
      end

      private def show_params
        {
          order_id: params[:id]
        }
      end

      private def distance_params
        {
          user_id: params[:id]
        }
      end

      private def current_distance_params
        {
          user_id: current_user.id
        }
      end
    end
  end
end
