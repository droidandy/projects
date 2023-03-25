module Api
  module V1
    module Users
      class VehiclesController < ApplicationController
        before_action :authenticate_user!

        def index
          search = ::Vehicles::Search.new(index_params, current_user: current_user)

          render json: ::Vehicles::Index.new(search.resolved_scope, current_user).as_json(with_documents: false)
        end

        def update
          service = ::Vehicles::Update.new(current_user, update_params)

          execute_and_process(service) do
            render json: ::Vehicles::Show.new(service.updated_vehicle, current_user).as_json(with_documents: false)
          end
        end

        private def index_params
          {
            user_id: params[:user_id]
          }
        end

        private def update_params
          {
            vehicle_id: params[:id],
            model: params[:model]
          }
        end
      end
    end
  end
end
