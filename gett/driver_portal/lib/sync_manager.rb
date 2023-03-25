class SyncManager
  LAST_SYNC_KEY = 'users_synced_at'.freeze
  SYNC_STARTED_KEY = 'users_sync_started_at'.freeze

  class << self
    def last_sync_at
      val = redis.get(LAST_SYNC_KEY)
      Time.zone.parse(val) if val.present?
    end

    def sync_started!
      redis.set(SYNC_STARTED_KEY, Time.current)
      redis.expire(SYNC_STARTED_KEY, settings.ttl)
    end

    def sync_succeeded!
      redis.del(SYNC_STARTED_KEY)
      redis.set(LAST_SYNC_KEY, Time.current)
    end

    def sync_failed!
      redis.del(SYNC_STARTED_KEY)
    end

    def sync_in_progress?
      sync_started_at.present?
    end

    def sync_started_at
      redis.get(SYNC_STARTED_KEY)
    end

    def settings
      Settings.sync_drivers
    end

    private def redis
      Redis.new
    end
  end
end
