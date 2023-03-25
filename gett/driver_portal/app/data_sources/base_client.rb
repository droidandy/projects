require 'rest-client'

class BaseClient
  delegate :api_url, :api_prefix, :auth_params,
    to: :config

  def auth
    RestClient.post(
      URI.join(api_url).merge('oauth/token').to_s,
      auth_params
    ) do |response|
      to_auth_response(response)
    end
  end

  private def call(endpoint, params = {})
    query = URI.encode_www_form(params)

    logger.info "===== Requested #{endpoint} ====="
    logger.info "With params: #{params}"

    RestClient.get(
      URI.join(api_url).merge("#{api_prefix}/#{endpoint}?#{query}").to_s,
      request_headers
    ) do |response|
      logger.info "===== Response for #{endpoint} ====="
      logger.info response
      to_generic_response(response)
    end
  end

  private def put(endpoint, params = {})
    logger.info "===== PUT request on #{endpoint} ====="
    logger.info "With params: #{params}"

    RestClient.put(
      URI.join(api_url).merge("#{api_prefix}/#{endpoint}").to_s,
      params,
      request_headers
    ) do |response|
      logger.info "===== Response for #{endpoint} ====="
      logger.info response
      to_generic_response(response)
    end
  end

  private def format_time(time)
    time = Time.zone.parse(time) unless time.is_a? Time
    time.utc.iso8601
  rescue StandardError
    nil
  end

  private def to_auth_response(response)
    GenericApiResponse.new(response.code, response.body)
  end

  private def to_generic_response(response)
    GenericApiResponse.new(response.code, response.body)
  end

  private def request_headers
    {
      authorization: "Bearer #{access_token}",
      content_type: :json,
      accept: :json
    }
  end

  private def access_token
    @access_token ||= (auth.body['access_token'] if auth.success?)
  end

  private def config
    OpenStruct.new(
      Rails.application.secrets[self.class.to_s.deconstantize.underscore]
    )
  end

  private def logger
    @logger ||= Logger.new(Rails.root.join('log', "#{self.class.to_s.deconstantize.underscore}_client.log"))
  end
end
