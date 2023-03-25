module Api
  module V1
    class StatisticsController < ApplicationController
      before_action :authenticate_user!

      def daily
        search = StatisticsEntries::Search.new(search_params)

        render json: StatisticsEntries::Index.new(search.daily(params[:type])).daily
      end

      def monthly
        search = StatisticsEntries::Search.new(search_params)

        render json: StatisticsEntries::Index.new(search.monthly(params[:type])).monthly
      end

      private def search_params
        {
          from: params[:from],
          to: params[:to]
        }
      end
    end
  end
end
