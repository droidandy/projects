require 'rails_helper'

RSpec.describe HomePrivacy::AddressHelpers do
  let(:helpers) { Object.new.extend(HomePrivacy::AddressHelpers) }

  describe '#safe_address_line' do
    subject { helpers.safe_address_line(address) }

    context 'when address is nil' do
      let(:address) { nil }

      it { is_expected.to be_nil }
    end

    context 'when address is present' do
      let(:address) { create(:address, line: '123 Street') }

      it { is_expected.to eq('123 Street') }

      context 'and when it is passenger home address and sanitanization is enabled' do
        around do |example|
          ApplicationService::Context.with_context(front_office: front_office, sanitize_home_address: true) do
            example.run
          end
        end

        before do
          allow(address).to receive(:[]).and_call_original
          allow(address).to receive(:[]).with(:passenger_address_type).and_return('home')
        end

        context 'in front office' do
          let(:front_office) { true }

          it { is_expected.to eq('Home') }
        end

        context 'not in front office' do
          let(:front_office) { false }

          it { is_expected.to eq('123 Street') }
        end
      end
    end
  end

  describe '#safe_address_as_json' do
    subject(:address_json) { helpers.safe_address_as_json(address, only: [:line, :lat, :lng, :postal_code])&.symbolize_keys }

    context 'when address is nil' do
      let(:address) { nil }

      it { is_expected.to be_nil }
    end

    context 'when address is present' do
      let(:address) { create(:address, line: '123 Street', lat: 1.0, lng: 2.0, postal_code: '123') }

      it { is_expected.to eq(line: '123 Street', lat: 1.0, lng: 2.0, postal_code: '123') }

      context 'and when it is passenger home address and sanitanization is enabled' do
        around do |example|
          ApplicationService::Context.with_context(front_office: front_office, sanitize_home_address: true) do
            example.run
          end
        end

        before { address.instance_variable_get('@values')[:passenger_address_type] = 'home' }

        context 'in front office' do
          let(:front_office) { true }

          it 'fetches json with sanitized address line' do
            expect(address_json).to eq(line: 'Home', lat: 1.0, lng: 2.0, postal_code: '123')
          end
        end

        context 'not in front office' do
          let(:front_office) { false }

          it 'fetches json with non-sanitized address line' do
            expect(address_json).to eq(line: '123 Street', lat: 1.0, lng: 2.0, postal_code: '123')
          end
        end
      end
    end
  end
end
