module Carey
  class Response
    RESPONSE_METHODS = {
      rate_inquiry:       :ota_ground_avail_rs,
      add_reservation:    :ota_ground_book_rs,
      find_reservation:   :ota_ground_res_retrieve_rs,
      cancel_reservation: :ota_ground_cancel_rs,
      modify_reservation: :ota_ground_book_rs
    }.freeze

    attr_reader :soap_response, :soap_method

    def initialize(response, soap_method:)
      @soap_method = soap_method
      @soap_response = response
    end

    def data
      @data ||= soap_response.body[response_method]
    end

    def success?
      error.blank?
    end

    def error
      data.dig(:errors, :error)
    end

    private def response_method
      RESPONSE_METHODS.fetch(soap_method)
    end
  end
end
