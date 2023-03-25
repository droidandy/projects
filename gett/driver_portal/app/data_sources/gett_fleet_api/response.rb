module GettFleetApi
  class Response < GenericApiResponse
    SUCCESS_CODE = 'SUCCESS'.freeze

    def success?
      http_status == 200 && body['code'] == SUCCESS_CODE
    end

    def results
      body['results']
    end

    def result
      body['result']
    end

    def error_message
      body['user_message']
    end
  end
end
