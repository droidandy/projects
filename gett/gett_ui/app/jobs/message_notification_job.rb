class MessageNotificationJob < ApplicationJob
  def perform(message)
    Faye.messages.notify_create_external(message)
  end
end
