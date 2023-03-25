require 'rails_helper'

RSpec.describe HomePrivacy::ServiceHelpers, type: :service do
  let(:service_class) do
    Class.new(ApplicationService) do
      include HomePrivacy::AddressHelpers
      include HomePrivacy::ServiceHelpers

      attributes :address, :sanitize

      private def execute!
        safe_address_line(address)
      end

      def skip_sanitize_home_address?
        !sanitize?
      end
    end
  end

  describe 'service execution' do
    let(:passenger) { create(:passenger) }
    let(:address)   { passenger.home_address }
    let(:service)   { service_class.new(address: address, sanitize: sanitize) }

    service_context { {front_office: true, sanitize_home_address: true} }

    before do
      create(:passenger_address, :home, address_line: '12 Baker Street', passenger: passenger)
    end

    context 'when #skip_sanitize_home_address? returns true' do
      let(:sanitize) { false }

      it 'does not sanitize home address' do
        expect(service.execute.result).to eq('12 Baker Street')
      end
    end

    context 'when #skip_sanitize_home_address? returns false' do
      let(:sanitize) { true }

      it 'sanitizes home address' do
        expect(service.execute.result).to eq('Home')
      end
    end
  end
end
