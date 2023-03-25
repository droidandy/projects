module ApplicationService::MutexModule
  extend ActiveSupport::Concern

  included do
    class_attribute :mutex
    self.mutex = Mutex.new
  end

  def sync
    mutex.synchronize{ yield }
  end
end
