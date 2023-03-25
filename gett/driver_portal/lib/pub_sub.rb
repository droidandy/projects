module PubSub
  class << self
    def publish(key, data)
      return if Rails.env.test?

      http = Net::HTTP.new(faye_host, faye_port)
      req = Net::HTTP::Post.new('/api/v1/faye', 'Content-Type' => 'application/json')
      req.body = {
        channel: "/#{channelize(key)}",
        data: data.to_json
      }.to_json
      http.request(req)
    end

    def channelize(key)
      Digest::SHA256.hexdigest([key.to_s, secret_key].join)
    end

    private def secret_key
      Rails.application.secrets.secret_key_base
    end

    private def faye_host
      Rails.application.secrets.faye[:host]
    end

    private def faye_port
      Rails.application.secrets.faye[:port]
    end
  end
end
