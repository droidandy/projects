module Admin::Messages
  class Create < BaseService
    def execute!
      result { message.save }
      faye_notify_creation if success?
    end

    def errors
      message.errors
    end

    private def message
      @message ||= Message.new(
        {sender: context.admin}.merge(params.message)
      )
    end

    private def faye_notify_creation
      Faye.messages.notify_create_external(message)
    end
  end
end
