module Admin::Messages
  class Index < ApplicationService
    include ApplicationService::Context

    LIMIT = ::Companies::Dashboard::MESSAGES_LIMIT

    def execute!
      Message.external.reverse(:created_at).limit(LIMIT).map do |message|
        ::Messages::Show.new(message: message).execute.result
      end
    end
  end
end
