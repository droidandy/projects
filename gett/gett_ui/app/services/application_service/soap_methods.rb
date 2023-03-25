require 'savon'

module ApplicationService::SoapMethods
  attr_reader :response

  def soap_request(soap_method, request_message)
    callbacks = ApplicationService::HttpCallbacks.new

    yield callbacks if block_given?

    catch :abort do
      callbacks.on_request(soap_method, request_message)
      @response = response_class.new(client.call(soap_method, request_message), soap_method: soap_method)

      callbacks.on_response(response)
      if response.success?
        callbacks.on_success(response)
      else
        error_message = request_error_message(soap_method, request_message)
        log_request_error(error_message)
        callbacks.on_failure(response, error_message)
      end

      response
    end
  end

  private def request_error_message(soap_method, request_message)
    "SoapClient::ErrorWithResponse - #{response.error} while processing request " \
      "'#{soap_method}' with message #{request_message.inspect}"
  end

  private def log_request_error(message)
    Rails.logger.error(message)
    Airbrake.notify(message) if notify_airbrake_on_soap_failure?
  end

  # TODO: refactor this module and it's usage
  private def notify_airbrake_on_soap_failure?
    true
  end

  private def client
    @client ||=
      begin
        options = {
          wsdl: wsdl_url,
          element_form_default: :qualified,
          convert_request_keys_to: :camelcase
        }
        options[:headers] = client_headers if client_headers.present?
        Savon.client(options.merge(client_options))
      end
  end

  private def client_options
    {}
  end

  private def wsdl_url
    fail "cannot perform requests without wsdl_url"
  end

  private def abort!
    throw :abort, false
  end

  private def response_class
    "#{self.class.parent}::Response".constantize
  end

  def execute!(&block)
    return unless valid?

    result { make_request!(&block) }
    assert { response&.success? }
  end

  private def make_request!(&block)
    soap_request(soap_method, request, &block)
  end

  def to_xml
    client.operation(soap_method).build(request)
  end

  def to_xml_string
    to_xml.to_s
  end

  private def soap_method
    self.class.name.demodulize.underscore.to_sym
  end

  private def valid?
    soap_method.present? && client.operations.include?(soap_method)
  end

  private def client_headers
    {}
  end
end
