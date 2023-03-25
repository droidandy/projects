module Api
  module V1
    class OnboardingsController < ApplicationController
      before_action :authenticate_user!

      def update
        service = ::Onboarding::Update.new(current_user, update_params)

        execute_and_process(service, error_opts: { without_field: true }) do
          render json: ::Users::Show.new(service.updated_user).as_json
        end
      end

      private def update_params
        params.require(:attributes)
      end
    end
  end
end
