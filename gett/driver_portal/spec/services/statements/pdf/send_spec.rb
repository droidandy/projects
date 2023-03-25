require 'rails_helper'

RSpec.describe Statements::PDF::Send do
  describe '#execute!' do
    let(:current_user) { create :user }
    subject { described_class.new(current_user, params) }

    let(:params) do
      {
        statements_ids: [1, 2]
      }
    end

    context 'when csv generated' do
      before(:each) { stub_service(Statements::CreateZIP, zip_data: '') }

      it 'runs successfully' do
        subject.execute!
        expect(subject).to be_success
      end

      it 'sends email to the user' do
        expect(StatementsMailer).to receive(:report)
          .with(current_user, '')
          .and_return(instance_double(ActionMailer::MessageDelivery, deliver_now: true))
        subject.execute!
      end
    end

    context 'when csv generation failed' do
      before(:each) { stub_service(Statements::CreateZIP, false, zip_data: nil, errors: {a: :b}) }

      it 'fails' do
        subject.execute!
        expect(subject).not_to be_success
        expect(subject.errors).to eq({a: :b})
      end
    end
  end
end
