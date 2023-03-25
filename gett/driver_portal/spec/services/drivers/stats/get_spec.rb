require 'rails_helper'

RSpec.describe Drivers::Stats::Get do
  describe '#execute!' do
    let(:body) { json_body('gett/finance_portal_api/driver_stats') }
    let(:user) { create :user, :with_driver_role, gett_id: 1 }
    let(:current_user) { create :user, :with_site_admin_role }

    let(:params) do
      {
        user_id: user.id
      }
    end

    subject { described_class.new(current_user, params) }

    context 'with valid params' do
      it 'runs successfully' do
        stub_client(FinancePortalApi::Client, :driver_stats, body)
        subject.execute!
        expect(subject).to be_success
      end

      it 'pass valid params' do
        expect_any_instance_of(FinancePortalApi::Client).to receive(:driver_stats).
          with(
            id: 1
          )
          .and_return(GenericApiResponse.new(200, body))
        subject.execute!
      end
    end

    context 'with invalid response' do
      before(:each) do
        stub_client(FinancePortalApi::Client, :driver_stats, [].to_json, 500)
      end

      it 'fails' do
        subject.execute!
        expect(subject).not_to be_success
        expect(subject.stats).to be_nil
        expect(subject.errors).to eq({ data: 'was not retrieved' })
      end
    end

    context 'with invalid user_id' do
      let(:params) do
        {
          user_id: 0
        }
      end

      it 'fails' do
        subject.execute!
        expect(subject).not_to be_success
        expect(subject.stats).to be_nil
        expect(subject.errors).to eq({ user: 'not found' })
      end
    end
  end
end
