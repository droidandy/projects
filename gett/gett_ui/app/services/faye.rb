module Faye
  module_function

  def channelize(obj)
    value = deep_channelize(obj)
    cipher = OpenSSL::Cipher::AES.new(256, :CBC).encrypt
    cipher.key = Digest::SHA256.digest(Rails.application.secrets.secret_key_base)

    Base64.encode64(cipher.update(value) + cipher.final).gsub(/\W/, '')
  end

  def deep_channelize(obj)
    case obj
    when GlobalID::Identification then obj.to_gid.to_s
    when Array then obj.map{ |item| deep_channelize(item) }.join
    when Hash then obj.map{ |_key, val| "key:#{deep_channelize(val)}" }.join
    else obj.to_s
    end
  end

  def notify(channel_object, data, success: true)
    Faye::Service.new(channel: channelize(channel_object), data: data, success: success).execute
  end

  def notify_channel(channel_key, data, success: true)
    Faye::Service.new(channel: channel_key, data: data, success: success).execute
  end

  def bookings
    @bookings ||= Faye::Bookings.new
  end

  def messages
    @messages ||= Faye::Messages.new
  end
end
