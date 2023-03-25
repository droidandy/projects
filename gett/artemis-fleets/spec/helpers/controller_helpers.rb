require 'json_web_token'

module ControllerHelpers
  def parsed_body
    @parsed_body ||= JSON.parse(response.body) rescue nil
  end

  def token_for(user)
    JsonWebToken.encode(id: user.id)
  end
end
