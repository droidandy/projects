module Feedbacks
  class Create < ApplicationService
    include ApplicationService::Context
    include ApplicationService::ModelMethods

    attributes :booking, :params
    delegate :member, to: :context
    delegate :errors, to: :feedback

    # anyone who can see a booking, can leave a related feeback
    def self.policy_class
      Bookings::ShowPolicy
    end

    def execute!
      result { create_model(feedback, params) }
      send_feedback_mail if success?
    end

    def feedback
      @feedback ||= Feedback.new(booking: booking, user: member)
    end

    private def send_feedback_mail
      FeedbacksMailer.feedback(feedback.id).deliver_later
    end
  end
end
