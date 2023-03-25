require 'rails_helper'

RSpec.describe Currencies::Rate, type: :service do
  describe '#execute' do
    context 'when from and to currencies specified' do
      subject(:service) { described_class.new(from: 'USD', to: 'GBP') }

      let(:response_body) { Rails.root.join('spec/fixtures/currencies/rate_response.json').read }
      let(:rate_response) { double(body: response_body, code: 200) }

      before do
        allow(RestClient).to receive(:get).and_return(rate_response)
        service.execute
      end

      it { is_expected.to be_success }
      its(:result) { is_expected.to eq(0.750101) }
    end

    context 'when any of currencies is not specified' do
      subject(:service) { described_class.new(from: 'USD') }

      before do
        expect(RestClient).not_to receive(:get)
        service.execute
      end

      it { is_expected.not_to be_success }
      its(:result) { is_expected.to be_nil }
    end
  end
end
