module Pcaw
  class FetchList < Base
    attributes :string, :last_id, :origin

    normalize_response do
      map from('/Items'), to('/list') do |list|
        normalize_array(list) do
          map from('/Id'), to('/id')
          map from('/Type'), to('/type')
          map from('/Text'), to('/text')
          map from('/Description'), to('/description')
        end
      end
    end

    def execute!
      super
      assert { result[:list].present? }
    end

    private def url
      super('/Capture/Interactive/Find/v1.00/json3ex.ws')
    end

    private def params
      params = super.merge(Text: string, Limit: 8)
      params = params.merge(Origin: origin || 'GBR')

      last_id ? params.merge(Container: last_id) : params
    end
  end
end
