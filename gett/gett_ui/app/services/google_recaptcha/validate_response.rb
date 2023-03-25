class GoogleRecaptcha::ValidateResponse < ApplicationService
  include ApplicationService::RestMethods

  BASE_URL = 'https://www.google.com/recaptcha/api/siteverify'.freeze
  private_constant :BASE_URL

  delegate :secret_key, to: 'Settings.google_recaptcha'

  attributes :captcha_response

  def execute!
    post(url, params) do |on|
      on.success{ success! }
      on.failure{ fail! }
    end
  end

  private def url
    "#{BASE_URL}?secret=#{secret_key}&response=#{captcha_response}"
  end

  private def params
    { content_type: "application/x-www-form-urlencoded; charset=utf-8" }
  end

  class Response < ApplicationService::RestMethods::Response
    def success?
      super && data['success'] == true
    end
  end
end
