require 'advisory_lock'

class BaseRequest
  # force_update: always rebuids the cache, skips if cannot acquire the lock immediately
  # skip_update: does not check or rebuild the cache
  def initialize(fleet_id, force_update: false, skip_update: false)
    @fleet_id = fleet_id
    @force_update = force_update
    @skip_update = skip_update
  end

  def execute
    check_and_rebuild_cache
    local_records
  end

  def remote_records
    GettBase.connection.execute(query).map do |row|
      Hash[columns.zip(row)]
    end
  end

  private

  def check_and_rebuild_cache
    return if @skip_update
    model.transaction do
      AdvisoryLock.new(lock_key, wait: !@force_update).acquire || return
      rebuild_cache if cache_expired?
    end
  end

  def lock_key
    request_key * 1_000_000 + @fleet_id.to_i
  end

  def rebuild_cache
    local_records.delete_all
    local_records.create!(remote_records)
    log_request
  end

  def local_records
    model.where(fleet_id: @fleet_id)
  end

  def log_request
    Request.log(self.class.name, @fleet_id)
  end

  def cache_expired?
    @force_update || Request.expired?(self.class.name, @fleet_id, ttl)
  end
end
