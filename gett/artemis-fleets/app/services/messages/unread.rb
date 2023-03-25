module Messages
  class Unread < BaseService
    def execute!
      result do
        Message
          .where('company_id = ? OR company_id IS NULL', context.company.id)
          .where('created_at > ?', newer_than)
          .map { |m| Messages::Show.new({message: m}).execute.result }
      end
    end

    def newer_than
      [context.user.notification_seen_at, Time.current - 1.day].compact.max
    end
  end
end
