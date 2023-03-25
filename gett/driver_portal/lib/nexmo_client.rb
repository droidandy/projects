class NexmoClient
  FROM = 'Driver Portal'.freeze

  attr_reader :phone, :message

  def initialize(phone, message)
    @phone = phone
    @message = message
  end

  def send_sms
    return unless secrets.fetch(:enabled) == 'true'
    response = RestClient.post(
      secrets.fetch(:api_url),
      signed_params.to_json,
      content_type: 'application/json'
    )
    response.code == 200
  end

  private def params
    {
      from: FROM,
      to: normalized_phone,
      text: message,
      api_key: secrets.fetch(:api_key),
      type: 'text',
      timestamp: Time.current.utc.to_i
    }
  end

  private def signed_params
    sig = '&' + CGI.unescape(URI.encode_www_form(params.sort)) + secrets.fetch(:security_secret)
    params.merge(sig: Digest::MD5.hexdigest(sig))
  end

  private def secrets
    Rails.application.secrets.nexmo
  end

  private def normalized_phone
    phone.sub(/^07/, '447')
  end
end
