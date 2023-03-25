module Api
  module V1
    module Users
      class ReviewsController < ApplicationController
        before_action :authenticate_user!

        def history
          search = ::Reviews::Search.new(history_params, current_user: current_user)

          render json: ::Reviews::Index.new(search.resolved_scope).as_json
        end

        def stats
          user = ::Users::Search.new({ id: params[:user_id] }, current_user: current_user).one

          if user
            render json: ::Reviews::Stats.new(user).as_json
          else
            head 404
          end
        end

        def approve
          service = ::Reviews::Approve.new(current_user, review_params)
          execute_and_process(service) do
            render json: {
              review: ::Reviews::Show.new(service.review).as_json,
              review_update: ::ReviewUpdates::Show.new(service.review_update).as_json
            }
          end
        end

        def reject
          service = ::Reviews::Reject.new(current_user, review_params)
          execute_and_process(service) do
            render json: {
              review: ::Reviews::Show.new(service.review).as_json,
              review_update: ::ReviewUpdates::Show.new(service.review_update).as_json
            }
          end
        end

        def approve_item
          service = ::Reviews::ApproveItem.new(current_user, review_params)
          execute_and_process(service) do
            render json: {
              review_update: ::ReviewUpdates::Show.new(service.review_update).as_json
            }
          end
        end

        def reject_item
          service = ::Reviews::RejectItem.new(current_user, review_params)
          execute_and_process(service) do
            render json: {
              review_update: ::ReviewUpdates::Show.new(service.review_update).as_json
            }
          end
        end

        private def history_params
          {
            driver_id: params[:user_id]
          }
        end

        private def review_params
          {
            driver_id: params[:user_id],
            requirement: params[:requirement],
            comment: params[:comment],
            gett_phone: params[:gett_phone]
          }
        end
      end
    end
  end
end
