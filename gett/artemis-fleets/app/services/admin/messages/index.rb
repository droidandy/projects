module Admin::Messages
  class Index < BaseService
    def execute!
      result do
        Message.external.order(created_at: :desc).map do |message|
          ::Messages::Show.new(message: message).execute.result
        end
      end
    end
  end
end
