class GenericApiResponse
  attr_reader :http_status, :response_body

  def initialize(http_status, response_body)
    @http_status = http_status
    @response_body = response_body
  end

  def success?
    http_status == 200 || http_status == 204
  end

  def body
    @body ||= JSON.parse(response_body)
  rescue JSON::ParserError
    {}
  end
end
