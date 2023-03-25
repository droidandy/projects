require 'jwt'

module JsonWebToken
  ALGORITHM = 'HS256'.freeze

  module_function

  def encode(payload)
    JWT.encode(payload, secret, ALGORITHM)
  end

  def decode(token)
    HashWithIndifferentAccess.new(JWT.decode(token, secret, true, algorithm: ALGORITHM)[0])
  rescue
    nil
  end

  def secret
    Rails.application.secrets.jwt_secret
  end
end
