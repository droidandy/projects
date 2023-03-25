module GoogleApi
  class AddressesList < Base
    # Documentation:
    # https://developers.google.com/places/web-service/autocomplete
    SUGGESTION_TYPES = %w(street_address establishment point_of_interest route).freeze
    private_constant :SUGGESTION_TYPES

    http_method :get

    attributes :string
    attributes :countries_filter # two character, ISO 3166-1 Alpha-2 compatible country code (en, fr, etc)

    normalize_response do
      map from('/predictions'), to('/list') do |list|
        items =
          list.map do |list_item|
            normalized =
              normalize(list_item) do
                map from('/place_id'), to('/id')
                map from('/description'), to('/text')
                map from('/types'), to('/types')
              end
            normalized.merge(google: true)
          end
        items.select{ |i| (i[:types] & SUGGESTION_TYPES).any? }
      end
      map from('status'), to('/status')
    end

    private def url
      url_for(Settings.google_api.autocomplete_url, input: string, components: countries_components)
    end

    private def countries_components
      return if countries_filter.blank?

      countries_filter.map { |code| "country:#{code}" }.join('|')
    end
  end
end
