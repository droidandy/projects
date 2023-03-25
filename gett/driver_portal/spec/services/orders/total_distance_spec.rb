require 'rails_helper'

RSpec.describe Orders::TotalDistance do
  describe '#execute!' do
    let(:body) { json_body('gett/finance_portal_api/orders') }
    let(:gett_id) { 1234 }
    let(:current_user) { create(:user, :with_site_admin_role, gett_id: gett_id) }

    let(:params) do
      {
        user_id: current_user.id
      }
    end

    subject { described_class.new(current_user, params) }

    context 'with all params' do
      it 'runs successfully' do
        stub_client(FinancePortalApi::Client, :orders, body)
        subject.execute!
        expect(subject).to be_success
      end

      it 'pass valid params' do
        expect_any_instance_of(FinancePortalApi::Client).to receive(:orders).
          with(
            from: Time.parse('2018-02-05T00:00:00+00:00'),
            to: Time.parse('2018-02-11T23:59:59.999999999+00:00'),
            driver_ids: [gett_id]
          )
          .and_return(GenericApiResponse.new(200, body))
        Timecop.freeze(Date.parse('2018-02-07')) do
          subject.execute!
        end
      end

      it 'returns valid distance' do
        stub_client(FinancePortalApi::Client, :orders, body)
        subject.execute!
        expect(subject.distance).to eq(3.1313)
      end
    end

    context 'with invalid response' do
      before(:each) do
        stub_client(FinancePortalApi::Client, :orders, [].to_json, 500)
      end

      it 'fails' do
        subject.execute!
        expect(subject).not_to be_success
        expect(subject.errors).to eq({ data: 'was not retrieved' })
      end
    end
  end
end
