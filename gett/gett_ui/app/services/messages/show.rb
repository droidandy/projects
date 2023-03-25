module Messages
  class Show < ApplicationService
    attributes :message

    def execute!
      data = message.as_json(only: [:id, :body, :title, :created_at, :sender_id])

      if message.internal?
        data[:title]  = message.sender.full_name
        data[:avatar] = message.sender.avatar_url
      end

      # currently all personal notifications are Warnings
      if message.personal?
        data[:alert_type] = Message::AlertType::WARNING
      end

      data
    end
  end
end
