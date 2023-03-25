module Messages
  class CreateInternal < ApplicationService
    include ApplicationService::Context
    include ApplicationService::Policy
    include ApplicationService::ModelMethods

    attributes :params
    delegate :member, :company, to: :context
    delegate :errors, to: :message

    def execute!
      result { create_model(message, params) }
      faye_notify_creation if success?
    end

    private def message
      @message ||=
        Message.new(
          company: company,
          sender: member,
          message_type: ::Message::MessageType::INTERNAL
        )
    end

    private def faye_notify_creation
      Faye.messages.notify_create_internal(company, message)
    end
  end
end
