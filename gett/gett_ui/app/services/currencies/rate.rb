module Currencies
  class Rate < ApplicationService
    include ApplicationService::RestMethods

    attributes :from, :to

    delegate :api_url, :app_id, to: 'Settings.open_exchange'

    CACHE_OPTIONS = {expires_in: 1.hour, race_condition_ttl: 10.seconds}.freeze

    def execute!
      return unless from.present? && to.present?

      Rails.cache.fetch("currencies/#{from}/#{to}", CACHE_OPTIONS) do
        get(url, content_type: 'application/json')
        result { response.data.dig('rates', to) }
      end
    end

    private def url
      api_url + "/latest.json?#{params.to_query}"
    end

    private def params
      {base: from, app_id: app_id}
    end
  end
end
