module Messages
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
        {company: context.company, sender: context.user}.merge(params.message)
      )
    end

    private def faye_notify_creation
      Faye.messages.notify_create_internal(context.company, message)
    end
  end
end
