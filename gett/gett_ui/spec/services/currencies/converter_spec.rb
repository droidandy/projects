require 'rails_helper'

RSpec.describe Currencies::Converter, type: :service do
  describe '#execute' do
    subject(:service) { described_class.new(from: 'USD', to: 'GBP', amount: 33) }

    let(:rate_service_double) { double(execute: double(result: 0.75)) }

    before do
      allow(Currencies::Rate).to receive(:new)
        .with(from: 'USD', to: 'GBP').and_return(rate_service_double)

      service.execute
    end

    it { is_expected.to be_success }
    its(:result) { is_expected.to eq(24.75) }

    context 'when :round attribute is present' do
      subject(:service) { described_class.new(from: 'USD', to: 'GBP', amount: 33, subunits: true) }

      its(:result) { is_expected.to eq(25) }
    end
  end
end
