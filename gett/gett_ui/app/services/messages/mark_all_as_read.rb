module Messages
  class MarkAllAsRead < ApplicationService
    include ApplicationService::Context
    include ApplicationService::ModelMethods

    delegate :member, to: :context

    def execute!
      update_model(member, notification_seen_at: Time.current)
    end
  end
end
