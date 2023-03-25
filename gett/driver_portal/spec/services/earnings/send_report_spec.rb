require 'rails_helper'

RSpec.describe Earnings::SendReport do
  describe '#execute!' do
    let(:current_user) { create(:user, :with_site_admin_role) }

    subject { described_class.new(current_user, params) }

    let(:from) { '2017-11-30T08:20:37Z' }
    let(:to) { '2017-12-30T08:20:37Z' }

    let(:params) do
      {
        driver: current_user,
        from: from,
        to: to,
        external_ids: ['external_id_2']
      }
    end

    context 'when csv generated' do
      before(:each) { stub_service(Earnings::GenerateCSV, csv: '') }

      it 'runs successfully' do
        subject.execute!
        expect(subject).to be_success
      end

      it 'sends email to the user' do
        expect(EarningsMailer).to receive(:report)
          .with(current_user, '')
          .and_return(instance_double(ActionMailer::MessageDelivery, deliver_now: true))
        subject.execute!
      end
    end

    context 'when csv generation failed' do
      before(:each) { stub_service(Earnings::GenerateCSV, false, csv: nil, errors: {a: :b}) }

      it 'fails' do
        subject.execute!
        expect(subject).not_to be_success
        expect(subject.errors).to eq({a: :b})
      end
    end
  end
end
