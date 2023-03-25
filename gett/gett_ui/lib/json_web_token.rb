require 'jwt'

module JsonWebToken
  ALGORITHM = 'HS256'.freeze

  module_function

  def encode(payload)
    JWT.encode(payload, Settings.jwt_secret, ALGORITHM)
  end

  def decode(token)
    HashWithIndifferentAccess.new(JWT.decode(token, Settings.jwt_secret, true, algorithm: ALGORITHM)[0])
  rescue StandardError
    nil
  end
end
