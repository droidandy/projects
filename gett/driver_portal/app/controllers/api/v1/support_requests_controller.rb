module Api
  module V1
    class SupportRequestsController < ApplicationController
      before_action :authenticate_user!

      def create
        service = SupportRequests::Create.new(current_user, create_params)

        execute_and_process(service)
      end

      private def create_params
        { message: params[:message] }
      end
    end
  end
end
