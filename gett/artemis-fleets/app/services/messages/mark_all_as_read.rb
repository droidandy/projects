module Messages
  class MarkAllAsRead < BaseService
    def execute!
      result do
        context.user.update_attributes(notification_seen_at: Time.current)
      end
    end
  end
end
