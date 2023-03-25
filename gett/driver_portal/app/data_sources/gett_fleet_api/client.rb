require 'rest-client'

module GettFleetApi
  class Client < BaseClient
    def drivers(driver_ids: [], fields: [], page: 1, per: 10)
      query = {}
      query[:only] = Array.wrap(fields) if Array.wrap(fields).any?
      query[:filter] = { id: Array.wrap(driver_ids) } if Array.wrap(driver_ids).any?
      query[:limit] = per
      query[:offset] = (page - 1) * per

      params = { query: query.to_json }

      call('drivers', params)
    end

    def driver(driver_id:, fields: [])
      query = {}
      query[:only] = Array.wrap(fields) if Array.wrap(fields).any?

      params = { query: query.to_json }

      call("drivers/#{driver_id}", params)
    end

    def update_driver(driver_id:, attributes: {})
      query = { only: attributes.keys }

      put("drivers/#{driver_id}", attributes.merge(query: query.to_json))
    end

    private def to_generic_response(response)
      Response.new(response.code, response.body)
    end
  end
end
