require 'rails_helper'

RSpec.describe Statements::List do
  describe '#execute!' do
    let(:body) { json_body('gett/finance_portal_api/statements') }
    let(:gett_id) { 1234 }
    let(:current_user) { create(:user, :with_site_admin_role, gett_id: gett_id) }

    let(:from) { '2017-11-30T08:20:37Z' }
    let(:to) { '2017-12-30T08:20:37Z' }

    let(:params) do
      {
        driver: current_user,
        statements_ids: [3, 4],
        from: from,
        to: to,
        page: 1,
        per_page: 2
      }
    end

    subject { described_class.new(current_user, params) }

    context 'with required params' do
      let(:params) do
        {
          driver: current_user
        }
      end

      it 'runs successfully' do
        stub_client(FinancePortalApi::Client, :statements, body)
        subject.execute!
        expect(subject).to be_success
      end
    end

    context 'with all params' do
      it 'runs successfully' do
        stub_client(FinancePortalApi::Client, :statements, body)
        subject.execute!
        expect(subject).to be_success
      end

      it 'pass valid params' do
        expect_any_instance_of(FinancePortalApi::Client).to receive(:statements).
          with(
            from: from,
            to: to,
            driver_ids: [gett_id],
            ids: [3, 4],
            page: 1,
            limit: 2
          )
          .and_return(GenericApiResponse.new(200, body))
        subject.execute!
      end

      it 'returns valid amount of data' do
        stub_client(FinancePortalApi::Client, :statements, body)
        subject.execute!
        expect(subject.statements.count).to eq(2)
      end
    end

    context 'with invalid params' do
      let(:params) do
        {
          driver: current_user,
          from: 'from',
          to: 'to'
        }
      end

      it 'runs with errors' do
        subject.execute!
        expect(subject).not_to be_success
      end

      it 'should contain errors' do
        subject.execute!
        expect(subject.errors.count).to eq(2)
      end
    end

    context 'with invalid response' do
      before(:each) do
        stub_client(FinancePortalApi::Client, :statements, [].to_json, 500)
      end

      it 'fails' do
        subject.execute!
        expect(subject).not_to be_success
      end

      it 'has errors' do
        subject.execute!
        expect(subject.errors).to eq({ data: 'was not retrieved' })
      end
    end
  end
end
