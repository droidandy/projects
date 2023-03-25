require 'rails_helper'

RSpec.describe Pcaw::FetchList, type: :service do
  let(:last_id) { nil }
  let(:origin) { nil }
  let(:service) { described_class.new(string: 'String', last_id: last_id, origin: origin) }

  describe '#params' do
    subject(:params) { service.send(:params) }

    context 'last_id attribute' do
      context 'is present' do
        let(:last_id) { '1670978' }

        its([:Container]) { is_expected.to eq last_id }
      end

      context 'not present' do
        let(:last_id) { nil }

        its([:Container]) { is_expected.to be_nil }
      end
    end

    context 'origin is abscent' do
      let(:origin) { nil }

      its([:Origin]) { is_expected.to eq 'GBR' }
    end

    context 'origin is present' do
      let(:origin) { 'some origin' }

      its([:Origin]) { is_expected.to eq origin }
    end
  end
end
