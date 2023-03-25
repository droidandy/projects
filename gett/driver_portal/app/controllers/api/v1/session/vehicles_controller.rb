module Api
  module V1
    module Session
      class VehiclesController < ApplicationController
        before_action :authenticate_user!

        def index
          search = ::Vehicles::Search.new(index_params, current_user: current_user)

          render json: ::Vehicles::Index.new(search.resolved_scope, current_user).as_json
        end

        def create
          service = ::Vehicles::Create.new(current_user, create_params)

          execute_and_process(service) do
            render json: ::Vehicles::Show.new(service.vehicle, current_user).as_json
          end
        end

        def update
          service = ::Vehicles::Update.new(current_user, update_params)

          execute_and_process(service) do
            render json: ::Vehicles::Show.new(service.updated_vehicle, current_user).as_json
          end
        end

        def destroy
          service = ::Vehicles::Hide.new(current_user, destroy_params)

          execute_and_process(service)
        end

        def set_as_current
          service = ::Vehicles::SetCurrent.new(current_user, set_as_current_params)

          execute_and_process(service) do
            search = ::Vehicles::Search.new({}, current_user: current_user)
            render json: ::Vehicles::Index.new(search.resolved_scope, current_user).as_json(with_documents: false)
          end
        end

        private def index_params
          {
            hidden: false
          }
        end

        private def create_params
          {
            title: params[:title]
          }
        end

        private def update_params
          {
            vehicle_id: params[:id],
            title: params[:title]
          }
        end

        private def destroy_params
          {
            vehicle_id: params[:id]
          }
        end

        private def set_as_current_params
          {
            vehicle_id: params[:id]
          }
        end
      end
    end
  end
end
