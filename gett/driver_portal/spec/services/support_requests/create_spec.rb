require 'rails_helper'

RSpec.describe SupportRequests::Create do
  describe '#execute!' do
    let(:current_user) { create(:user, :with_avatar) }

    subject { described_class.new(current_user, params) }

    let(:message) { 'Lorem ipsum' }

    let(:params) do
      {
        message: message
      }
    end

    it 'runs successfully' do
      subject.execute!
      expect(subject).to be_success
    end

    it 'sends email to support' do
      expect(SupportRequestsMailer).to receive(:contact_us)
        .with(current_user, message)
        .and_return(instance_double(ActionMailer::MessageDelivery, deliver_now: true))
      subject.execute!
    end
  end
end
