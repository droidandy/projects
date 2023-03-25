require 'rails_helper'

RSpec.describe Statements::ForSync do
  describe '#execute!' do
    let(:body) { [1, 2, 3].to_json }
    let(:current_user) { nil }

    let(:params) do
      {
        changed_after: '2017-11-30T08:20:37Z',
        page: 1,
        per_page: 2
      }
    end

    subject { described_class.new(current_user, params) }

    context 'with valid params' do
      it 'runs successfully' do
        stub_client(FinancePortalApi::Client, :statements, body)
        subject.execute!
        expect(subject).to be_success
      end

      it 'pass valid params' do
        expect_any_instance_of(FinancePortalApi::Client).to receive(:statements).
          with(
            changed_after: '2017-11-30T08:20:37Z',
            ids_only: true,
            page: 1,
            limit: 2
          )
          .and_return(GenericApiResponse.new(200, body))
        subject.execute!
      end

      it 'returns valid ids' do
        stub_client(FinancePortalApi::Client, :statements, body)
        subject.execute!
        expect(subject.statements_ids).to eq([1, 2, 3])
      end
    end

    context 'with invalid response' do
      before(:each) do
        stub_client(FinancePortalApi::Client, :statements, [].to_json, 500)
      end

      it 'fails' do
        subject.execute!
        expect(subject).not_to be_success
        expect(subject.errors).to eq({ data: 'was not retrieved' })
      end
    end
  end
end
