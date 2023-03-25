require 'rails_helper'

RSpec.describe Drivers::FetchChannel, type: :service do
  describe '#execute' do
    subject(:service) { Drivers::FetchChannel.new(params: params) }

    let(:company) { create(:company, address_id: create(:address).id) }
    let(:address) { company.address }

    service_context { { company: company } }

    context 'when no params is passed' do
      let(:params) { nil }
      let(:cords) { { lat: address[:lat], lng: address[:lng] } }

      context 'channel already exists' do
        let(:channel) { create(:drivers_channel) }

        before do
          allow(DriversChannel).to receive(:in_close_vicinity_to).and_return(channel)
        end

        it do
          expect(DriversChannel).to receive(:in_close_vicinity_to).with(cords)

          expect(service.execute).to be_success
          expect(service.result).to eq(channel.channel)
        end
      end

      context "channel doesn't exist" do
        let(:channel_key) { 'some_channel' }
        let(:channel) { create(:drivers_channel, channel: channel_key) }
        let(:time)    { 1.minute.from_now }

        before do
          allow(DriversChannel).to receive(:in_close_vicinity_to).and_return(false)
          allow(Faye).to receive(:channelize).and_return(channel_key)
          allow(DriversChannel).to receive(:create).and_return(channel)
          allow_any_instance_of(ActiveSupport::Duration).to receive(:from_now).and_return(time) # stub 1.minute.from_now
        end

        it do
          expect(DriversChannel).to receive(:in_close_vicinity_to).with(cords)
          expect(Faye).to receive(:channelize).with("drivers-map-#{cords[:lat]}-#{cords[:lng]}")
          expect(DriversChannel).to receive(:create).with(
            channel: 'some_channel',
            location: [cords[:lat], cords[:lng]],
            valid_until: time,
            country_code: company.address.country_code
          )

          expect(service.execute).to be_success
          expect(service.result).to eq(channel_key)
        end
      end
    end

    context 'when params is passed' do
      let(:params) { { lat: '52.23', lng: '0.12' } }

      let(:channel) { create(:drivers_channel) }

      before do
        allow(DriversChannel).to receive(:in_close_vicinity_to).and_return(channel)
      end

      it 'check that DriverChannel.in_close_vicinity_to receives correct parameters' do
        expect(DriversChannel).to receive(:in_close_vicinity_to).with(params)

        expect(service.execute).to be_success
        expect(service.result).to eq(channel.channel)
      end
    end
  end
end
