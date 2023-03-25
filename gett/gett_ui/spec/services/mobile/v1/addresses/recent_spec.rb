require 'rails_helper'

RSpec.describe Mobile::V1::Addresses::Recent, type: :service do
  let(:company) { create(:company) }
  let(:member)  { create(:booker, company: company) }
  let(:addresses) { create_list(:address, 10, lat: -34.008076, lng: 71.3245365) }

  let(:service) { described_class.new }

  before do
    create(:booking, company: company, booker: member, pickup_address: addresses[0], destination_address: addresses[1], created_at: 5.minutes.ago)
    create(:booking, company: company, booker: member, pickup_address: addresses[2], destination_address: addresses[3], created_at: 3.minutes.ago)
    create(:booking, company: company, booker: member, pickup_address: addresses[2], destination_address: addresses[3], stop_addresses: [addresses[4]], created_at: 1.minute.ago)
    create(:booking, company: company, passenger: member, pickup_address: addresses[5], destination_address: addresses[6], created_at: 2.minutes.ago)
    create(:booking, company: company, passenger: member, pickup_address: addresses[7], destination_address: addresses[8], created_at: 4.minutes.ago)
    create(:booking, company: company, passenger: member, pickup_address: addresses[7], destination_address: addresses[8], stop_addresses: [addresses[9]], created_at: 6.minutes.ago)
  end

  service_context { { company: company, member: member } }

  let(:result) do
    [
      addresses[2].id,
      addresses[3].id,
      addresses[4].id,
      addresses[5].id,
      addresses[6].id,
      addresses[7].id,
      addresses[8].id,
      addresses[0].id,
      addresses[1].id,
      addresses[9].id
    ]
  end

  describe '#execute' do
    it 'delegates to geocoding service and maps result' do
      expect(service.execute).to be_success
      expect(service.result[:list].map{ |addr| addr['id'] }).to match_array result
      expect(service.result[:list].first['lng']).to eq 71.3245365
      expect(service.result[:list].first['lat']).to eq -34.008076
    end
  end
end
