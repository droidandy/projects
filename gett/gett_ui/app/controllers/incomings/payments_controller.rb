module Incomings
  class PaymentsController < ApplicationController
    skip_before_action :authenticate

    def create
      Payments::Webhook.new(payments_os_id: params[:id]).execute
      head :ok
    end
  end
end
