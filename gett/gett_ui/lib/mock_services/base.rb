# When server receives request we check if X-Mock-Data header is set.
# If it is set we parse JSON string value and store in RequestStore.store[:x_mock_data]
# When we perform any external request to any provider, VCR hanldles it with
# MockServices::Base.around_hook method.
# If we are unable to find mock service for given request or request is set to be
# ignored we process request with real provider.
# If we are able to find mock service for the request we setup VCR cassette
# evaluate previously recorded ERB response with erb_parameters and return
# response to client service object without hitting real provider
#
# Format of X-Mock-Data is JSON string equivalent to hash
# { <service_name>: { <request_type>: { variable1: value1, variable2: value2 } } }
#
# Examples:
# return '221b backer street' for autocompelte and details
# {"google_maps": { "autocomplete": { "input": "221b backer street"}, "details": {"address": "221 b backer street"}}}
#
# hit real autocomplete address, but return mocked '221b backer street' for details
# {"google_maps": { "autocomplete": { "ignore": true}, "details": {"address": "221 b backer street"}}}
#
# don't use mock service for all google_maps request
# {"google_maps": {"ignore": true}}
#
# use 'not_found' template for 'products' request to gett_api
# {"get_api": {"products": {"template": "not_found"}}}
#
# All existing services/request_types/templates can be found by executing
# `tree spec/cassettes`
#
# All the used variables are listed in lib/mock_services/<service_name> in method
# erb_parameters

module MockServices
  class Base
    # Around hook used in vcr.rb
    def self.around_hook(request)
      # Find mock service for this request
      mock = Base.for(request)

      # If there are no mock for this request or mock ignores this request
      # mark request as ignored and process without cassette
      if !mock || mock.ignore?
        request = VCR::Request::Typed.new(request, :ignored)
        request.proceed
        return
      end

      # Else process request using mock.cassette
      VCR.use_cassette(
        mock.cassette,
        decode_compressed_response: true,
        match_requests_on: [:method, mock.method(:request_matcher)],
        record: :once,
        erb: mock.erb_parameters,
        &request
      )
    end

    # Store available mock calsses in @services class variable
    def self.inherited(klass)
      @services ||= []
      @services << klass
    end

    # Find mock class for given request
    def self.find_mock_service(request)
      @services&.find { |s| s.match?(request) }
    end

    # Return mock object for given request
    # or nil if unable to find
    def self.for(request)
      service = find_mock_service(request)
      return unless service

      service.new(request)
    end

    # Check if request can be processed with this mock class
    def self.match?(request)
      new(request).match?
    end

    attr_reader :request

    def initialize(request)
      @request = request
    end

    # If request url matches any `match_urls` for this class and
    # we are able to identify request type, request can be processed
    # with given mock object
    def match?
      return false unless self.class.match_urls.any? { |url| request.uri.match(url) }

      !!request_type
    end

    # Mock variables overrides current request type
    def mock_data
      service_mock_data.fetch(request_type.to_sym, {})
    end

    # Mock variables overrides for this mock service
    def service_mock_data
      RequestStore.store.dig(:x_mock_data, service_name.to_sym) || {}
    end

    # Request is ignored if it was previously ignored or
    # mock service if set to be ignored or
    # request type for current mock is ignored
    def ignore?
      service_mock_data.fetch(:ignore, false) ||
        mock_data.fetch(:ignore, false) ||
        request.try(:type) == :ignored
    end

    # Parse URI parameters
    def request_parameters
      OpenStruct.new(CGI.parse(URI(request.uri).query || ''))
    end

    # Parse and convert to OpenStruct XML body
    def xml_body_to_openstruct
      JSON.parse(Hash.from_xml(request.body).to_json, object_class: OpenStruct)
    end

    # Return cassette name for given request in format
    # <service_name>/<method>__<request_type>/<template>
    def cassette
      [
        service_name,
        [
          request.method,
          request_type
        ].compact.join('__'),
        response_template
      ].join('/')
    end

    # Check if 2 requests are simmilar
    def request_matcher(request1, request2)
      mock1 = self.class.new(request1)
      mock2 = self.class.new(request2)

      mock1 == mock2
    end

    # request are similar if they have same request_type and response template
    def ==(other)
      request_type == other.request_type &&
        response_template == other.response_template
    end

    # Memoize request parameters
    private def params
      @params ||= request_parameters
    end

    # Hash used for response ERB template processing
    private def erb_parameters
      {}
    end

    # Service name. Recommended to redefine in child class.
    # Default value is hostname of request URI
    def service_name
      URI(request.uri).host
    end

    # Default request type. Should be overriden in child class
    def request_type
      'regular'
    end

    # Response template. Can be changed by providing template variable for
    # specific request type
    def response_template
      mock_data.fetch(:template, 'happy_path')
    end
  end
end
