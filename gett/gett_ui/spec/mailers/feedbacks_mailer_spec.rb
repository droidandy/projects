require 'rails_helper'

describe FeedbacksMailer do
  describe '#feedback' do
    let(:feedback) { create(:feedback) }

    subject { described_class.feedback(feedback.id) }

    its(:subject) { is_expected.to eql "#{feedback.booking.service_id} Gett Business Solutions powered by One Transport Feedback" }
    its(:to)            { is_expected.to eql ['customer.services@one-transport.co.uk'] }
    its(:from)          { is_expected.to eql ['donotreply@gett.com'] }
    its(:reply_to)      { is_expected.to eql [feedback.user.email] }
    its('body.encoded') { is_expected.to include feedback.rating.to_s }
    its('body.encoded') { is_expected.to include feedback.message }
    its('body.encoded') { is_expected.to include feedback.user.company.name }
    its('body.encoded') { is_expected.to include feedback.user.full_name }
    its('body.encoded') { is_expected.to include feedback.booking.service_id }
  end
end
