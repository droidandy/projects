module Api
  module V1
    class RootController < ApplicationController
      def welcome
        render json: {
          message: 'It Works!'
        }
      end
    end
  end
end
