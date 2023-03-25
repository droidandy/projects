module GoogleApi
  class NearbySearch < Base
    attributes :location, :type, :radius, :rankby, :name, :pagetoken

    http_method :get

    normalize_response do
      map from('results'), to('list') do |list|
        normalize_array(list) do
          map from('place_id'), to('id')
          map from('name'), to('text')
          map from('types'), to('types')
        end
      end
      map from('next_page_token'), to('next_page_token')
      map from('status'), to('status')
    end

    private def url
      url_for(Settings.google_api.nearby_search_url, attributes.symbolize_keys)
    end
  end
end
