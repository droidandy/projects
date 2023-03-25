module Drivers
  class SendError < StandardError
  end
end

class SendDriverJob < ApplicationJob
  queue_as :default

  def perform(driver_id)
    driver = User.find(driver_id)
    service = DriversApi::SendWholeDriver.new(driver: driver)
    service.execute!
    raise Drivers::SendError unless service.success?
  end
end
