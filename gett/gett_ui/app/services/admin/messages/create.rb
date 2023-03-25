module Admin::Messages
  class Create < ApplicationService
    include ApplicationService::ModelMethods
    include ApplicationService::Context

    attributes :params
    delegate :errors, to: :message
    delegate :admin, to: :context

    def execute!
      result { create_model(message, params) }
      faye_notify_creation if success?
    end

    private def message
      @message ||=
        Message.new(
          sender: admin,
          message_type: ::Message::MessageType::EXTERNAL
        )
    end

    private def faye_notify_creation
      Faye.messages.notify_create_external(message)
    end
  end
end
