module Api
  module V1
    class StatementsController < ApplicationController
      before_action :authenticate_user!

      def index
        service = Statements::List.new(current_user, index_params)

        execute_and_process(service) do
          render json: Statements::Index.new(service.statements, index_params[:page], index_params[:per_page]).as_json
        end
      end

      def generate_pdf
        service = Statements::CreateZIP.new(current_user, pdf_params)

        execute_and_process(service) do
          render json: { url: service.zip_url }
        end
      end

      def email_me
        service = Statements::PDF::Send.new(current_user, email_me_params)

        execute_and_process(service)
      end

      def share
        service = Statements::PDF::Share.new(current_user, sharing_params)

        execute_and_process(service)
      end

      def by_date
        service = Statements::GetByDate.new(current_user, by_date_params)

        execute_and_process(service) do
          render json: Statements::Show.new(service.statement).as_json
        end
      end

      private def index_params
        {
          driver: current_user,
          from: params[:from],
          to: params[:to],
          page: params[:page] || 1,
          per_page: params[:per_page] || 5,
          statements_ids: params[:ids].to_s.split(',')
        }
      end

      private def pdf_params
        {
          statements_ids: params[:ids]
        }
      end

      private def email_me_params
        {
          statements_ids: params[:ids]
        }
      end

      private def sharing_params
        {
          statements_ids: params[:ids],
          emails: params[:emails],
          body: params[:body]
        }
      end

      private def by_date_params
        {
          issued_at: params[:issued_at]
        }
      end
    end
  end
end
