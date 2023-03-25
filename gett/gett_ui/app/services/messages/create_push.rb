module Messages
  class CreatePush < ApplicationService
    include ApplicationService::ModelMethods

    attributes :recipient, :push_data

    delegate :errors, to: :message

    def execute!
      create_model(message)
    end

    private def message
      @message ||=
        Message.new(
          message_type: Message::MessageType::PUSH,
          recipient:    recipient,
          body:         push_data.to_json
        )
    end
  end
end
