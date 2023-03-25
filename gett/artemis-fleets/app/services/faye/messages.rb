module Faye
  # Small helper class for a syntatic sugar of a kind `Faye.messages.notify_create_external`
  class Messages
    def notify_create_internal(company, message)
      Faye.notify("messages-#{company.id}", message: message_data(message))
    end

    def notify_create_external(message)
      Faye.notify("messages", message: message_data(message))
    end

    private def message_data(message)
      ::Messages::Show.new(message: message).execute.result
    end
  end
end
