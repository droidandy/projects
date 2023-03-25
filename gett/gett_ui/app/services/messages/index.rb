module Messages
  class Index < ApplicationService
    include ApplicationService::Context

    delegate :member, to: :context

    LIMIT_NOTIFICATIONS = 100

    def execute!
      { items: notifications }
    end

    def notifications
      notifications_dataset
        .first(LIMIT_NOTIFICATIONS)
        .map { |msg| message_as_json(msg) }
    end

    def notifications_dataset
      Message
        .where(message_type: Message::MessageType::EXTERNAL)
        .or(message_type: Message::MessageType::INTERNAL, company_id: member.company_id)
        .or(message_type: [Message::MessageType::PERSONAL, Message::MessageType::PUSH], recipient_id: member.id)
        .order(Sequel.desc(:created_at))
    end

    private def message_as_json(msg)
      msg.as_json(only: [:id, :title, :created_at]).tap do |hash|
        hash[:booking_id] = msg.data&.dig(:data, :booking_id)
        hash[:body] = msg.message_body
      end
    end
  end
end
