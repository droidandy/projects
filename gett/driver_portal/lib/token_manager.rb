class TokenManager
  KEY_PREFIX = 'user_token'.freeze
  TTL = 1.minute

  def initialize(token: nil, driver_id: nil)
    @token = token
    @driver_id = driver_id
  end

  def write
    redis.set(redis_key, driver_id)
    redis.expire(redis_key, TTL)
  end

  def token
    @token ||= SecureRandom.uuid
  end

  def driver_id
    @driver_id ||= redis.get(redis_key)
  end

  private def redis_key
    @redis_key ||= "#{KEY_PREFIX}_#{token}"
  end

  private def redis
    Redis.new
  end
end
