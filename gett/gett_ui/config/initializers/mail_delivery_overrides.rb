if Rails.env.test_features?
  require 'action_mailer'
  class ActionMailer::MessageDelivery
    def deliver_later(*)
      deliver_now
    end
  end
end
