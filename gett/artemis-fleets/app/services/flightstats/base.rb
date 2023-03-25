require 'rest-client'

module Flightstats
  class Base
    BASE_URL = 'https://api.flightstats.com/flex'.freeze
    private_constant :BASE_URL

    attr_reader :params, :response

    def initialize(params:)
      @params = params
    end

    def processed_response
      fail "#{self.class} does not implement ##{__method__} method"
    end

    private def sanitized_flight
      params[:flight].gsub(/[^a-zA-Z\d]/, '').upcase
    end

    private def carrier
      sanitized_flight[0..1]
    end

    private def flight_number
      sanitized_flight[2..-1]
    end

    def result
      return @result unless block_given?
      @result = yield
    end

    def success?
      @result
    end

    def get(url, headers = {}, &block)
      @response = request(:get, url, headers, &block)
    end

    private def request(method, *args)
      @response = self.class::Response.new(RestClient.public_send(method, *args))
    rescue RestClient::ExceptionWithResponse => error
      @response = self.class::Response.new(error.response)
    end

    private def log_request_error(error, method, args)
      message = "RestClient::ExceptionWithResponse - #{error.message} #{error.response.body}, " \
        "while processing #{method.to_s.upcase} request with arguments #{args.inspect}"
      Rails.logger.error(message)
    end

    private def headers
      {
        'appId'  => Rails.application.secrets.flightstats[:client_id],
        'appKey' => Rails.application.secrets.flightstats[:client_secret]
      }
    end

    private def dev_execute?
      Rails.env.development? || Rails.env.dev?
    end

    class Response < SimpleDelegator
      def success?
        code.in?(200..204)
      end

      def data
        @data ||= body.present? ? JSON.parse(body) : {}
      end
    end
  end
end
