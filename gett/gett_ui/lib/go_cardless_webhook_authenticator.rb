require 'openssl'

class GoCardlessWebhookAuthenticator
  def initialize(request)
    @request = request
  end

  attr_reader :request

  def authenticate
    Rack::Utils.secure_compare(provided_signature, computed_signature)
  end

  private def computed_signature
    OpenSSL::HMAC.hexdigest(
      OpenSSL::Digest.new('sha256'),
      Settings.go_cardless.webhook_secret,
      request.raw_post
    )
  end

  private def provided_signature
    request.headers['Webhook-Signature']
  end
end
