require 'rails_helper'

RSpec.describe Statements::GetByDate do
  describe '#execute!' do
    subject { described_class.new(current_user, params) }
    let(:current_user) { create :user, gett_id: 123 }

    let(:issued_at) { Time.current.to_s }
    let(:params) do
      {
        issued_at: issued_at
      }
    end

    context 'with valid response' do
      let(:body) { json_body('gett/finance_portal_api/statements') }

      it 'pass valid params' do
        expect_any_instance_of(FinancePortalApi::Client).to receive(:statements)
          .with(at: issued_at, driver_ids: [123])
          .and_return(GenericApiResponse.new(200, body))
        subject.execute!
      end

      it 'parses and returns data' do
        allow_any_instance_of(FinancePortalApi::Client).to receive(:statements)
          .and_return(GenericApiResponse.new(200, body))
        expect_any_instance_of(Statements::Parser).to receive(:parse)
          .and_return('parsed_statement')
        subject.execute!
        expect(subject.statement).to eq('parsed_statement')
      end
    end

    context 'with empty response' do
      let(:body) { [].to_json }

      it 'should return nothing' do
        stub_client(FinancePortalApi::Client, :statements, body)
        subject.execute!

        expect(subject.statement).to be_nil
      end
    end

    context 'with invalid response' do
      let(:body) { {errors: []}.to_json }

      it 'should return nothing' do
        stub_client(FinancePortalApi::Client, :statements, body, 400)
        subject.execute!

        expect(subject.statement).to be_nil
      end
    end
  end
end
