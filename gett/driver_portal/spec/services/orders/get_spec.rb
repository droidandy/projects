require 'rails_helper'

RSpec.describe Orders::Get do
  describe '#execute!' do
    subject { described_class.new(current_user, params) }
    let(:current_user) { create :user }

    let(:order_id) { 12345 }
    let(:params) do
      {
        order_id: order_id
      }
    end

    context 'with valid response' do
      let(:body) { json_body('gett/finance_portal_api/order') }

      it 'pass valid params' do
        expect_any_instance_of(FinancePortalApi::Client).to receive(:order)
          .with(id: order_id)
          .and_return(GenericApiResponse.new(200, body))
        subject.execute!
      end

      it 'parses and returns data' do
        allow_any_instance_of(FinancePortalApi::Client).to receive(:order)
          .and_return(GenericApiResponse.new(200, body))
        expect_any_instance_of(Orders::Parser).to receive(:parse)
          .and_return('parsed_order')
        subject.execute!
        expect(subject.order).to eq('parsed_order')
      end
    end

    context 'with invalid response' do
      let(:body) { {errors: []}.to_json }
      before(:each) do
        stub_client(FinancePortalApi::Client, :order, body, 400)
        subject.execute!
      end

      it 'should be failed' do
        expect(subject).not_to be_success
      end

      it 'should return nothing' do
        expect(subject.order).to be_nil
      end
    end
  end
end
