module Messages
  class Unread < ApplicationService
    include ApplicationService::Context
    include ApplicationService::Policy

    delegate :member, to: :context

    def execute!
      result do
        messages_dataset.eager(:sender).all.map do |message|
          Messages::Show.new(message: message).execute.result
        end
      end
    end

    private def messages_dataset
      newer_than = [member.notification_seen_at, Time.current - 1.day].compact.max

      policy_scope.where{ messages[:created_at] > newer_than }
    end
  end
end
