# this is a reusable block to prevent duplication of code in sidekiq initializer
REDIS_CONNECTION =
  if Settings.redis.url.present?
    -> { Redis.new(url: Settings.redis.url) }
  else
    lambda do
      Redis.new(
        url: Settings.redis.master_url,
        sentinels: [{ host: Settings.redis.sentinel_host, port: Settings.redis.sentinel_port }],
        role: :master
      )
    end
  end

Redis.current = REDIS_CONNECTION.call
