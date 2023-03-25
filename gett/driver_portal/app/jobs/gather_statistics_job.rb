module Statistics
  class GatherFailed < StandardError
  end
end

class GatherStatisticsJob < ApplicationJob
  queue_as :default

  def perform
    service = Statistics::Gather.new(system_user, date: Date.yesterday.to_s)
    service.execute!
    raise Statistics::GatherFailed unless service.success?
  end
end
