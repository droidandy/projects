require 'rails_helper'

RSpec.describe Statements::GetHTML do
  describe '#execute!' do
    let(:body) { 'statement_html' }
    let(:current_user) { create :user, :with_driver_role }

    let(:params) do
      {
        statement_id: 1
      }
    end

    subject { described_class.new(current_user, params) }

    context 'with valid response' do
      it 'runs successfully' do
        stub_client(FinancePortalApi::Client, :statement_html, body)
        subject.execute!
        expect(subject).to be_success
      end

      it 'pass valid params' do
        expect_any_instance_of(FinancePortalApi::Client).to receive(:statement_html)
          .with(id: 1)
          .and_return(GenericApiResponse.new(200, body))
        subject.execute!
      end

      it 'returns valid data' do
        stub_client(FinancePortalApi::Client, :statement_html, body)
        subject.execute!
        expect(subject.html).to eq('statement_html')
      end
    end

    context 'with invalid response' do
      before(:each) do
        stub_client(FinancePortalApi::Client, :statement_html, '', 500)
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
