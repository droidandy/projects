class External::BaseController < ApplicationController
  def current_member
    current_user if current_user.is_a?(Member)
  end

  private def api_key
    request.headers['X-Api-Key']
  end

  private def user_from_token
    ApiKey.first(key: api_key)&.user
  end
end
