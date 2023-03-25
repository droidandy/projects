module DriversApi
  class Base < ApplicationService

    def execute!
      process_response
    end

    protected def process_response
      if response.success?
        yield response.body if block_given?
        success!
      else
        fail!(errors: { base: response.body['error'] })
      end
    end

    protected def client
      @client ||= GettDriversApi::Client.new
    end
  end
end
