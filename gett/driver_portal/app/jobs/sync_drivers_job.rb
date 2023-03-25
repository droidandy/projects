module Drivers
  class SyncError < StandardError
  end
end

class SyncDriversJob < ApplicationJob
  queue_as :default

  def perform
    service = System::SyncDrivers::All.new(system_user)
    service.execute!
    raise Drivers::SyncError unless service.success?
  end
end
