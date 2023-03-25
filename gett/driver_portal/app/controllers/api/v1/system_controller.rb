module Api
  module V1
    class SystemController < ApplicationController
      before_action :authenticate_user!

      def status
        service = System::Check::All.new(current_user)

        execute_and_process(service) do
          render json: service.results
        end
      end
    end
  end
end
