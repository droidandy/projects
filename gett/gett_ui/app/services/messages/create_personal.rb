module Messages
  class CreatePersonal < ApplicationService
    include ApplicationService::ModelMethods

    attributes :recipient, :message_body

    delegate :errors, to: :message

    def execute!
      result { create_model(message) }
      faye_notify_creation if success?
    end

    private def message
      @message ||=
        Message.new(
          recipient: recipient,
          body: message_body,
          message_type: ::Message::MessageType::PERSONAL
        )
    end

    private def faye_notify_creation
      Faye.messages.notify_create_personal(recipient, message)
    end
  end
end
