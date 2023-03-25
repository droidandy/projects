class Session
  attr_reader :access_token, :data

  def initialize(access_token)
    @access_token = access_token
    @data = decoded_access_token
  end

  def valid?
    timestamp = redis.get(session_key)
    if timestamp
      touch # rubocop:disable Rails/SkipsModelValidations
      true
    else
      false
    end
  end

  def touch
    redis.pipelined do
      redis.set(session_key, Time.current)
      redis.expire(session_key, settings.ttl)
      redis.set(user_key, Time.current)
    end
  end

  def last_activity
    timestamp = redis.get(user_key(user_id))
    Time.zone.parse(timestamp) if timestamp
  rescue TypeError
    nil
  end

  def user_id
    @user_id ||= data['id']
  end

  def uuid
    @uuid ||= data['uuid']
  end

  def user
    @user ||= User.find(user_id)
  end

  private def user_key
    self.class.user_key(user_id)
  end

  private def session_key
    self.class.session_key(user_id, uuid)
  end

  private def redis
    @redis ||= Redis.new
  end

  private def decoded_access_token
    JWT.decode(@access_token, self.class.jwt_secret, true, algorithm: 'HS256')[0]
  end

  private def settings
    @settings ||= Settings.sessions
  end

  class << self
    def last_activity(user)
      timestamp = redis.get(user_key(user.id))
      Time.zone.parse(timestamp) if timestamp
    rescue TypeError
      nil
    end

    def user_key(user_id)
      "sessions:#{user_id}"
    end

    def session_key(user_id, uuid)
      "#{user_key(user_id)}:#{uuid}"
    end

    def encoded_user(user)
      JWT.encode(Users::Show.new(user).as_jwt, jwt_secret, 'HS256')
    end

    def jwt_secret
      Rails.application.secrets.jwt_secret
    end

    private def redis
      Redis.new
    end
  end
end
