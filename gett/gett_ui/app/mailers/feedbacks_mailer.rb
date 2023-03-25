class FeedbacksMailer < ApplicationMailer
  def feedback(feedback_id)
    @feedback = Feedback.with_pk!(feedback_id)
    @user = @feedback.user

    mail to: 'customer.services@one-transport.co.uk',
      subject: "#{@feedback.booking.service_id} Gett Business Solutions powered by One Transport Feedback",
      reply_to: @user.email
  end
end
