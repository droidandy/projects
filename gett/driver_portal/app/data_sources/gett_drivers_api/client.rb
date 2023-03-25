require 'rest-client'

module GettDriversApi
  class Client < BaseClient
    def create_car(attributes: {})
      post('car', attributes)
    end

    def create_driver(attributes: {})
      post("#{api_prefix}/driver", attributes)
    end

    def update_driver(driver_id:, attributes: {})
      put("#{api_prefix}/driver/#{driver_id}", attributes)
    end

    def create_document(driver_id:, car_id: nil, attributes: {})
      path = car_id ? "driver/#{driver_id}/car/#{car_id}" : "driver/#{driver_id}"
      post("#{api_prefix}/#{path}/document", attributes)
    end

    def document_upload(driver_id:, car_id: nil, document_id:, file:, content_type:)
      path = car_id ? "driver/#{driver_id}/car/#{car_id}" : "driver/#{driver_id}"
      upload_file(
        "#{api_prefix}/#{path}/document/#{document_id}/upload",
        file,
        method: :put,
        content_type: content_type
      )
    end

    def assign_car(driver_id:, car_id:, title:)
      put("#{api_prefix}/driver/#{driver_id}/car/#{car_id}", title: title)
    end

    def search_car(license:)
      get('cars', license: license, env: 'uk')
    end

    private def get(endpoint, params = {})
      query = URI.encode_www_form(params)

      call endpoint: "#{endpoint}?#{query}",
           method: :get
    end

    private def post(endpoint, params = {})
      call endpoint: endpoint,
           method: :post,
           headers: { content_type: :json, accept: :json },
           payload: params.to_json
    end

    private def put(endpoint, params = {})
      call endpoint: endpoint,
           method: :put,
           headers: { content_type: :json, accept: :json },
           payload: params.to_json
    end

    private def upload_file(endpoint, file, method: :post, content_type: 'application/x-binary')
      call endpoint: endpoint,
           method: method,
           headers: { content_type: content_type },
           payload: open(file.full_path)
    end

    private def call(endpoint:, method:, payload: nil, headers: {})
      logger.info "===== #{method.to_s.upcase} request on #{endpoint} ====="
      logger.info "With params: #{payload}"

      RestClient::Request.execute(
        method: method,
        url: URI.join(api_url).merge(endpoint).to_s,
        payload: payload,
        headers: headers
      ) do |response|
        logger.info "===== Response for #{endpoint} ====="
        logger.info "Status: #{response.code}"
        logger.info "Body: #{response.body}"
        to_generic_response(response)
      end
    end
  end
end
