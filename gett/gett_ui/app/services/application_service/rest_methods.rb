require 'rest-client'

module ApplicationService::RestMethods
  extend ActiveSupport::Concern

  HTTP_METHODS = %i[get post patch put delete].freeze
  private_constant :HTTP_METHODS

  module ClassMethods
    def http_method(method)
      define_method(:http_method) { method }
    end
  end

  attr_reader :response

  private def make_request!(&block)
    assert_valid_http_method!
    public_send(http_method, url, params, &block)
  end

  private def assert_valid_http_method!
    unless HTTP_METHODS.include?(http_method.to_sym)
      fail "Invalid http method #{http_method.inspect}"
    end
  end

  def get(url, headers = {}, &block)
    @response = request(:get, url, headers.reverse_merge(default_headers), &block)
  end

  def post(url, params, headers = {}, &block)
    @response = request(:post, url, convert_params(params), headers.reverse_merge(default_headers), &block)
  end

  def patch(url, params, headers = {}, &block)
    @response = request(:patch, url, convert_params(params), headers.reverse_merge(default_headers), &block)
  end

  def delete(url, headers = {}, &block)
    request(:delete, url, headers.reverse_merge(default_headers), &block)
  end

  private def convert_params(params)
    (request_type == :json) ? params.to_json : params
  end

  private def default_headers
    {}
  end

  private def request_type(type = :json)
    @request_type ||= type
  end

  private def request(method, *args)
    callbacks = ApplicationService::HttpCallbacks.new

    yield callbacks if block_given?

    catch :abort do
      callbacks.on_request(*args)
      @response = self.class::Response.new(RestClient.public_send(method, *args))

      callbacks.on_response(response)
      if response.success?
        callbacks.on_success(response)
      else
        callbacks.on_failure(response)
      end

      response
    end
  rescue RestClient::ExceptionWithResponse => error
    @response = self.class::Response.new(error.response)

    error_message = request_error_message(error, method, args)
    log_request_error(error_message)
    callbacks.on_error(error)
    callbacks.on_failure(error.response, error_message)

    @response
  end

  private def request_error_message(error, method, args)
    "RestClient::ExceptionWithResponse - #{error.message} #{error.response&.body}, " \
      "while processing #{method.to_s.upcase} request with arguments #{args.inspect}"
  end

  private def log_request_error(message)
    Rails.logger.error(message)
    Airbrake.notify(message)
  end

  private def abort!
    throw :abort, false
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
