module Api
  module V1
    module News
      class ImagesController < ApplicationController
        before_action :authenticate_user!, except: :image

        def create
          service = ::News::Images::Create.new(current_user, create_params)

          service.execute!
          execute_and_process(service) do
            render json: ::News::Images::Show.new(service.created_image).as_json
          end
        end

        def create_unbound
          service = ::News::Images::Create.new(current_user, create_unbound_params)

          service.execute!
          execute_and_process(service) do
            render json: ::News::Images::Show.new(service.created_image).as_json
          end
        end

        def image
          image_model = ::News::Image.find(params[:id])
          if image_model.try(:image)
            redirect_to image_model.image.full_url
          else
            head 404
          end
        end

        private def create_params
          {
            image: params[:image],
            news_item_id: params[:news_id]
          }
        end

        private def create_unbound_params
          {
            image: params[:image],
            binding_hash: params[:binding_hash]
          }
        end
      end
    end
  end
end
