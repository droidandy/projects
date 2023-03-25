module Faye
  module_function

  def channelize(obj)
    value = obj.class < GlobalID::Identification ? obj.to_gid.to_s : obj.to_s
    cipher = OpenSSL::Cipher::AES.new(256, :CBC).encrypt
    cipher.key = Digest::SHA256.digest(Rails.application.secrets.secret_key_base)

    Base64.encode64(cipher.update(value) + cipher.final).gsub(/\W/, '')
  end

  def notify(channel_object, data, success: true)
    Faye::Service.new(channel: channelize(channel_object), data: data, success: success).execute
  end

  def messages
    @messages ||= Faye::Messages.new
  end
end
