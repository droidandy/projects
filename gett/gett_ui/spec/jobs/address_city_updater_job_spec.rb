require 'rails_helper'

RSpec.describe AddressCityUpdaterJob, type: :job do
  let!(:address)     { create(:address, city: nil, country_code: country_code) }
  let(:country_code) { 'US' }

  subject(:service) { described_class.new }

  describe '#perform' do
    let(:google_result) { { city: 'Google City' } }
    let(:pcaw_list_result) do
      { list: [
        { id: 'loc_id_1', type: 'Type' },
        { id: 'loc_id_2', type: 'Address' },
        { id: 'loc_id_3', type: 'Address' },
        { id: 'loc_id_4', type: 'Address' }
      ] }
    end
    let(:pcaw_address_result) { { city: 'Pcaw City' } }

    let(:google_geocode_service_stub) do
      double(execute: double(success?: google_geocode_success), result: google_result)
    end
    let(:pcaw_list_service_stub) do
      double(execute: double(success?: pcaw_list_success), result: pcaw_list_result)
    end
    let(:pcaw_address_service_stub) do
      double(execute: double(success?: true), result: pcaw_address_result)
    end

    let(:google_geocode_success) { false }
    let(:pcaw_list_success) { false }

    before do
      allow(GoogleApi::ReverseGeocode).to receive(:new).and_return(google_geocode_service_stub)
      allow(Pcaw::FetchList).to receive(:new).and_return(pcaw_list_service_stub)
      allow(Pcaw::FetchAddress).to receive(:new).and_return(pcaw_address_service_stub)
      allow(subject).to receive(:addresses).and_return([address])
    end

    context 'found through Google Geocoder' do
      let(:google_geocode_success) { true }

      it 'calls only Google Geocoder and updates city' do
        expect(google_geocode_service_stub).to receive(:execute)
        expect(google_geocode_service_stub).to receive(:result)
        expect(pcaw_list_service_stub).not_to receive(:execute)
        expect(pcaw_address_service_stub).not_to receive(:execute)

        expect{ subject.perform }.to change{ address.city }.to('Google City')
      end
    end

    context 'not found through Google Geocoder' do
      let(:pcaw_list_success) { true }

      it 'calls Google Geocoder and Pcaw services and updates city' do
        expect(google_geocode_service_stub).to receive(:execute)
        expect(google_geocode_service_stub).not_to receive(:result)
        expect(pcaw_list_service_stub).to receive(:execute)
        expect(pcaw_list_service_stub).to receive(:result)
        expect(pcaw_address_service_stub).to receive(:execute)
        expect(pcaw_address_service_stub).to receive(:result)
        expect(Pcaw::FetchAddress).to receive(:new).with(location_id: 'loc_id_2').once

        expect{ subject.perform }.to change{ address.city }.to('Pcaw City')
      end
    end

    context 'not found through Google Geocoder and PCAW' do
      before do
        expect(google_geocode_service_stub).to receive(:execute)
        expect(google_geocode_service_stub).not_to receive(:result)
        expect(pcaw_list_service_stub).to receive(:execute)
        expect(pcaw_list_service_stub).not_to receive(:result)
      end

      context 'non GB address' do
        it 'does not call #try_with_pio and not changes city' do
          expect(service).not_to receive(:try_with_pio_by_postal_code)
          expect{ subject.perform }.not_to change{ address.city }
        end
      end

      context 'GB address' do
        let(:country_code) { 'GB' }

        context 'found through PIO by postal code' do
          before { allow(service).to receive(:try_with_pio_by_postal_code).and_return('PIO by postal code City') }

          it 'calls Google Geocoder, Pcaw services and PIO and updates city' do
            expect(service).to receive(:try_with_pio_by_postal_code)
            expect{ subject.perform }.to change{ address.city }.to('PIO by postal code City')
          end
        end

        context 'found through PIO by coords' do
          before do
            allow(service).to receive(:try_with_pio_by_postal_code).and_return(nil)
            allow(service).to receive(:try_with_pio_by_coords).and_return('PIO by coords City')
          end

          it 'calls Google Geocoder, Pcaw services and PIO and updates city' do
            expect(service).to receive(:try_with_pio_by_postal_code)
            expect(service).to receive(:try_with_pio_by_coords)
            expect{ subject.perform }.to change{ address.city }.to('PIO by coords City')
          end
        end
      end
    end
  end

  describe '#addresses' do
    let!(:predefined_address) { create(:address, city: nil) }

    subject{ service.send(:addresses) }

    it { is_expected.to match_array [address, predefined_address] }
  end
end
