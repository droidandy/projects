module Api
  module V1
    module News
      class CommentsController < ApplicationController
        before_action :authenticate_user!

        def index
          search = ::Comments::Search.new(index_params, current_user: current_user)

          render json: Comments::Index.new(search.resolved_scope.root, current_user).as_json
        end

        def create
          service = ::News::Comments::Create.new(current_user, create_params)

          execute_and_process(service) do
            render json: Comments::Show.new(service.comment, current_user).as_json
          end
        end

        def create_nested
          service = ::News::Comments::Create.new(current_user, create_nested_params)

          execute_and_process(service) do
            render json: Comments::Show.new(service.comment, current_user).as_json
          end
        end

        def like
          service = ::Likes::Create.new(current_user, like_params)

          execute_and_process(service) do
            render json: ::Comments::Show.new(service.comment, current_user).as_json
          end
        end

        def unlike
          service = ::Likes::Destroy.new(current_user, unlike_params)

          execute_and_process(service) do
            render json: ::Comments::Show.new(service.comment, current_user).as_json
          end
        end

        private def index_params
          {
            commentable_id: params[:news_id],
            commentable_type: 'News::Item'
          }
        end

        private def create_params
          {
            content: params[:content],
            news_item_id: params[:news_id]
          }
        end

        private def create_nested_params
          {
            content: params[:content],
            news_item_id: params[:news_id],
            parent_id: params[:id]
          }
        end

        private def like_params
          {
            comment_id: params[:id],
            value: params[:value]
          }
        end

        private def unlike_params
          {
            comment_id: params[:id]
          }
        end
      end
    end
  end
end
