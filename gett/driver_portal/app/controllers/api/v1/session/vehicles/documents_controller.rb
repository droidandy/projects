module Api
  module V1
    module Session
      module Vehicles
        class DocumentsController < ApplicationController
          before_action :authenticate_user!

          def create
            service = ::Documents::CreateForVehicle.new(current_user, current_admin, create_params)

            execute_and_process(service) do
              render json: ::Documents::Show.new(service.document).as_json
            end
          end

          private def create_params
            {
              file: params[:file],
              kind_slug: params[:kind],
              vehicle_id: params[:vehicle_id]
            }
          end
        end
      end
    end
  end
end
