module Api
  module V1
    module Session
      class DocumentsController < ApplicationController
        before_action :authenticate_user!

        def index
          service = ::Documents::DriverList.new(current_user)

          execute_and_process(service) do
            render json: ::Documents::GroupedIndex.new(service.documents).as_json
          end
        end

        def create
          service = ::Documents::CreateForDriver.new(current_user, current_admin, create_params)

          execute_and_process(service) do
            render json: ::Documents::Show.new(service.document).as_json
          end
        end

        private def create_params
          {
            file: params[:file],
            kind_slug: params[:kind]
          }
        end
      end
    end
  end
end
