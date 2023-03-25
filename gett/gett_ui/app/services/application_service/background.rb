module ApplicationService::Background
  extend ActiveSupport::Concern

  included do
    prepend BackgroundExecute

    class_attribute :bg_attributes_list
    self.bg_attributes_list = []
  end

  private def notify(anchor, data, success: true)
    Faye.notify(anchor, data, success: success)
  end

  private def send_to_background(attrs)
    channel_values = attrs.values_at(*bg_attributes_list)
    result { Faye.channelize(channel_values) }
    ServiceJob.perform_later(self.class.name, attrs)
  end

  module ClassMethods
    def background_attributes(*attrs)
      bg_attributes_list.concat(attrs)
      attributes(*attrs)
    end
  end

  module BackgroundExecute
    def execute!
      return super unless Sidekiq.server?

      result = background_execute!
      @result = result unless defined?(@result)
      channel_values = bg_attributes_list.map{ |attr| public_send(attr) }
      notify(channel_values, result, success: success?)
    end
  end
end
