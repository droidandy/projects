module SupportRequests
  class Create < ApplicationService
    schema do
      required(:message).filled(:str?)
    end

    def execute!
      SupportRequestsMailer.contact_us(current_user, message).deliver_now
      success!
    end
  end
end
