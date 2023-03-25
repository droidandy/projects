module Nexmo
  class SMS < ApplicationService
    include ApplicationService::RestMethods
    include ApplicationService::Context
    include ApplicationService::ModelMethods

    BASE_URL = 'https://rest.nexmo.com/sms/json'.freeze
    private_constant :BASE_URL

    attributes :phone, :message

    delegate :api_key, :security_secret, to: 'Settings.nexmo'

    def execute!
      # In development, execute only if flag was explicitly enabled
      return if Rails.env.development? && !Settings.nexmo.enabled

      Array(phone).map do |phone|
        post_params = sign(base_params.merge(to: sanitize_phone(phone)))

        post(url, post_params) do |on|
          request = Request.new(service_provider: 'nexmo')

          on.request do |url|
            create_model(request, url: url, request_payload: post_params, status: :sent)
          end

          on.success do |response|
            update_model(request, response_payload: response.body, status: :processed)
          end

          on.failure do |response|
            update_model(request, response_payload: response.body, status: :error)
          end
        end
      end
    end

    private def default_headers
      {content_type: "application/json"}
    end

    private def base_params
      {
        from: 'Gett',
        text: message,
        api_key: api_key,
        type: 'text',
        timestamp: Time.now.getutc.to_i
      }
    end

    private def sign(params)
      signature_params = params.merge(text: sanitized_message)
      sig = '&' + CGI.unescape(URI.encode_www_form(signature_params.sort)) + security_secret
      params.merge(sig: Digest::MD5.hexdigest(sig))
    end

    private def url
      BASE_URL
    end

    private def sanitize_phone(phone_number)
      phone_number.delete('^+0-9')
    end

    private def sanitized_message
      message.gsub(/[&=]/, '_')
    end

    class Response < ApplicationService::RestMethods::Response
      def success?
        super && data.dig(:messages, 0, :status) == '0'
      end

      def data
        super.with_indifferent_access
      end
    end
  end
end
