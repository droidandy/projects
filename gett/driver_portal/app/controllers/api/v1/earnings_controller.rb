module Api
  module V1
    class EarningsController < ApplicationController
      before_action :authenticate_user!

      def index
        service = Earnings::List.new(current_user, index_params)

        execute_and_process(service) do
          render json: Earnings::Index.new(service.earnings, index_params[:page], index_params[:per_page]).as_json
        end
      end

      def generate_csv
        service = Earnings::SaveCSV.new(current_user, csv_params)

        execute_and_process(service) do
          render json: { url: service.csv_url }
        end
      end

      def email_me
        service = Earnings::SendReport.new(current_user, email_me_params)

        execute_and_process(service)
      end

      def share
        service = Earnings::ShareCSV.new(current_user, sharing_params)

        execute_and_process(service)
      end

      private def index_params
        {
          driver: current_user,
          from: params[:from],
          to: params[:to],
          page: params[:page] || 1,
          per_page: params[:per_page] || 5
        }
      end

      private def csv_params
        {
          driver: current_user,
          from: params[:from],
          to: params[:to],
          external_ids: params[:external_ids]
        }
      end

      private def email_me_params
        {
          driver: current_user,
          from: params[:from],
          to: params[:to],
          external_ids: params[:external_ids]
        }
      end

      private def sharing_params
        {
          driver: current_user,
          from: params[:from],
          to: params[:to],
          emails: params[:emails],
          body: params[:body],
          external_ids: params[:external_ids]
        }
      end

      private def details_params
        {
          order_id: params[:order_id],
          issued_at: params[:issued_at]
        }
      end
    end
  end
end
