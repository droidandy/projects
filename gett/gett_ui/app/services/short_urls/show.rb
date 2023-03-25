module ShortUrls
  class Show < ApplicationService
    attributes :token

    def execute!
      ShortUrl.find(token: token).as_json
    end
  end
end
