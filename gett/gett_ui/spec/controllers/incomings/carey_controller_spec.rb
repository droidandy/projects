require 'rails_helper'

RSpec.describe Incomings::CareyController do
  describe 'outbound_expense' do
    before do
      request.headers['api_key'] = api_key
    end

    let(:price_update_payload) do
      { transactionDateTime: 'data' }
    end

    before do
      allow(Incomings::Carey::PriceUpdateHandler).to receive(:new).and_return(double.as_null_object)
    end

    context 'when api key is valid' do
      let(:api_key) { 'AccessToken' }

      it 'asks Carey status update handler' do
        expect(Incomings::Carey::PriceUpdateHandler.new).to receive(:execute)
        process :outbound_expense, method: :post, params: price_update_payload
      end

      it 'returns 200 OK' do
        process :outbound_expense, method: :post, params: price_update_payload
        expect(response.code).to eq("200")
      end
    end

    context 'when api key is not valid' do
      let(:api_key) { 'SomeKey' }

      it 'asks Carey status update handler' do
        expect(Incomings::Carey::PriceUpdateHandler.new).not_to receive(:execute)
        process :outbound_expense, method: :post, params: price_update_payload
      end

      it 'returns 401' do
        process :outbound_expense, method: :post, params: price_update_payload
        expect(response.code).to eq("401")
      end
    end
  end

  describe 'trip_status' do
    let(:status_update_payload) do
      { some: 'data' }
    end

    before do
      allow(Incomings::Carey::StatusUpdateHandler).to receive(:new).and_return(double.as_null_object)
    end

    it 'asks Carey status update handler' do
      expect(Incomings::Carey::StatusUpdateHandler.new).to receive(:execute)
      process :trip_status, method: :post, params: status_update_payload
    end

    it 'returns 200 OK' do
      process :trip_status, method: :post, params: status_update_payload
      expect(response.code).to eq("200")
    end
  end
end
