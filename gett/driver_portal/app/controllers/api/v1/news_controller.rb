module Api
  module V1
    class NewsController < ApplicationController
      before_action :authenticate_user!

      def index
        search = ::News::Items::Search.new(index_params, current_user: current_user)

        render json: ::News::Items::Index.new(search.resolved_scope.preload(:author)).as_json
      end

      def show
        service = ::News::Show.new(current_user, show_params)
        execute_and_process(service) do
          render json: ::News::Items::Show.new(service.news_item).as_json
        end
      end

      def create
        service = ::News::Create.new(current_user, create_params)

        execute_and_process(service) do
          render json: ::News::Items::Show.new(service.news_item).as_json
        end
      end

      def update
        service = ::News::Update.new(current_user, update_params)

        execute_and_process(service) do
          render json: ::News::Items::Show.new(service.news_item).as_json
        end
      end

      def destroy
        service = ::News::Destroy.new(current_user, destroy_params)

        execute_and_process(service)
      end

      private def show_params
        {
          news_item_id: params[:id]
        }
      end

      private def index_params
        {
          page: params[:page] || 1,
          per_page: params[:per_page] || 10,
          sort_column: params[:sort_column],
          sort_direction: params[:sort_direction]
        }
      end

      private def create_params
        {
          title: params[:title],
          published_at: params[:published_at],
          item_type: params[:item_type],
          content: params[:content],
          image: params[:image],
          number: params[:number],
          binging_hash: params[:binging_hash]
        }
      end

      private def update_params
        hash = {
          news_item_id: params[:id],
          title: params[:title],
          published_at: params[:published_at],
          item_type: params[:item_type],
          content: params[:content],
          image: params[:image],
          number: params[:number]
        }
        hash.delete :image unless params[:image]
        hash
      end

      private def destroy_params
        {
          news_item_id: params[:id]
        }
      end
    end
  end
end
