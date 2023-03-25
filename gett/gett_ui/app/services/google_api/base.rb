require 'base64'
require 'openssl'
require 'uri'

class GoogleApi::Base < ApplicationService
  include ApplicationService::NormalizedResponse
  include ApplicationService::RestMethods

  LANGUAGE = :en

  delegate :private_key, :client_id, :open_key, :channel, to: 'Settings.google_api'

  def self.sign_url!
    @sign_url = true
  end

  def self.sign_url?
    !!@sign_url
  end

  def execute!
    return unless available?

    get(sign_url? ? signed_url : url_with_key)
    result { normalized_response }
  end

  def available?
    client_id.present? && private_key.present?
  end

  private def sign_url?
    self.class.sign_url?
  end

  private def url
    fail "#{self.class} does not implement ##{__method__} method"
  end

  private def signed_url
    uri = URI.parse(url)
    signature = generate_signature(uri.request_uri)

    "#{uri.scheme}://#{uri.host}#{uri.request_uri}&signature=#{signature}"
  end

  private def url_with_key
    uri = URI.parse(url)

    "#{uri.scheme}://#{uri.host}#{uri.request_uri}&key=#{open_key}"
  end

  # please visit https://developers.google.com/maps/documentation/distance-matrix/get-api-key?hl=en
  # for references.
  private def generate_signature(path)
    digest = OpenSSL::Digest.new('sha1')
    raw_signature = OpenSSL::HMAC.digest(digest, raw_key, path)

    Base64.encode64(raw_signature).tr('+/', '-_').strip
  end

  private def raw_key
    Base64.decode64(private_key.tr('-_', '+/'))
  end

  private def url_for(base, params)
    params.merge!(language: LANGUAGE, channel: channel)

    "#{base}?#{params.to_param}"
  end
end
