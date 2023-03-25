module Api
  module V1
    module Users
      class DocumentsController < ApplicationController
        before_action :authenticate_user!

        def index
          search = ::Documents::Search.new(index_params, current_user: current_user)

          render json: ::Documents::Index.new(search.resolved_scope.includes(:kind)).as_json
        end

        def kinds
          search = ::Documents::Kinds::Search.new(kinds_params, current_user: current_user)

          render json: ::Documents::Kinds::Index.new(search.resolved_scope.preload(:fields)).as_json(with_fields: true)
        end

        def approve
          service = ::Documents::Approve.new(current_user, approve_params)

          execute_and_process(service) do
            render json: ::Documents::Show.new(service.document).as_json(with_user: true)
          end
        end

        def reject
          service = ::Documents::Reject.new(current_user, reject_params)

          execute_and_process(service) do
            render json: ::Documents::Show.new(service.document).as_json(with_user: true)
          end
        end

        private def index_params
          {
            user_id: params[:user_id],
            driver_bound: true
          }
        end

        private def kinds_params
          {
            owner: :driver
          }
        end

        private def approve_params
          {
            document_id: params[:id],
            metadata: params[:metadata].try(:to_unsafe_h)
          }
        end

        private def reject_params
          {
            document_id: params[:id],
            metadata: params[:metadata].try(:to_unsafe_h),
            comment: params[:comment]
          }
        end
      end
    end
  end
end
