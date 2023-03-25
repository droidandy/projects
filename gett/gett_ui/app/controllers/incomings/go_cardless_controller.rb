require 'go_cardless_webhook_authenticator'

module Incomings
  class GoCardlessController < ApplicationController
    skip_before_action :authenticate

    def create
      if GoCardlessWebhookAuthenticator.new(request).authenticate
        GoCardless::Webhook.new(events: params[:events]).execute
        head :ok
      else
        # https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#Unofficial_codes
        head 498 # Invalid Token (Esri)
      end
    end
  end
end
