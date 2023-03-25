require 'rails_helper'

RSpec.describe Bookings::DriverUpdater, type: :service do
  let(:booking) { create :booking, :on_the_way }

  subject(:service) { described_class.new(booking: booking, params: params) }

  describe '#execute' do
    before { allow(GoogleApi).to receive(:find_distance).and_return(response_in_mi) }

    let(:params) { { lat: Faker::Address.latitude, lng: Faker::Address.longitude } }

    let(:response_in_ft) do
      Hashie::Mash.new(
        distance_measure: "feet",
        distance:      330.0,
        duration_text: "1 min",
        duration_sec:  1
      )
    end

    let(:response_in_mi) do
      Hashie::Mash.new(
        distance_measure: "miles",
        distance:      0.3,
        duration_text: "6 mins",
        duration_sec:  338
      )
    end

    context 'distance' do
      context 'returned distance in ft' do
        before do
          expect(GoogleApi).to receive(:find_distance).and_return(response_in_ft)
          service.execute
        end

        it 'sets correct distance' do
          expect(booking.driver.distance).to eq 330
        end
      end

      context 'returned distance in mi' do
        before do
          expect(GoogleApi).to receive(:find_distance).and_return(response_in_mi)
          service.execute
        end

        it 'sets correct distance' do
          expect(booking.driver.distance).to eq 1584
        end
      end

      context 'when booking status is not on_the_way or in_progress' do
        it 'sets distance to nil' do
          service.execute
          expect(booking.driver.distance).to eq 1584
        end
      end

      context 'when booking is in progress without destination address' do
        let(:booking) { create :booking, :in_progress, destination_address: false }

        it "doesn't send request to GoogleApi and returns nil" do
          expect(GoogleApi).not_to receive(:find_distance)

          service.execute
          expect(booking.driver.distance).to be nil
        end
      end
    end

    context 'eta' do
      before { service.execute }

      context 'asap booking' do
        let(:booking) { create :booking, :asap, :on_the_way }

        it 'returns eta from google response' do
          expect(booking.driver.eta).to eq 6
        end
      end

      context 'future booking' do
        let(:booking) { create :booking, :scheduled, :on_the_way, scheduled_at: 2.hours.from_now }

        it 'returns minutes between allocated_at and scheduled_at' do
          expect(booking.driver.eta).to eq 120
        end
      end

      context 'when booking status is not on_the_way or in_progress' do
        it 'sets distance to nil' do
          service.execute
          expect(booking.driver.distance).to eq 1584
        end
      end
    end

    context 'location_updated_at' do
      let(:booking) { create :booking, :with_driver }
      let(:previous_location_updated_at) { Time.current - 10.minutes }

      before do
        booking.driver.update(location_updated_at: previous_location_updated_at)
      end

      context 'location changed' do
        before { subject.execute }

        let(:params) { { lat: Faker::Address.latitude, lng: Faker::Address.longitude } }

        it 'updates location_updated_at' do
          expect(booking.driver.location_updated_at).not_to eq previous_location_updated_at
        end
      end

      context 'location rounded correctly' do
        let(:params) { { lat: 51.51146411584408, lng: -0.1208100467920303 } }

        before do
          # lat and lng will be automatically round here
          booking.driver.update(
            lat: 51.51146411584408,
            lng: -0.1208100467920303
          )
          booking.driver.reload
          subject.execute
          booking.driver.reload
        end

        it 'does not update location_updated_at' do
          expect(booking.driver.lat).to eq 51.5114641158441
          expect(booking.driver.lng).to eq -0.12081004679203
          expect(booking.driver.location_updated_at.to_i).to eq previous_location_updated_at.to_datetime.to_i
        end
      end

      context 'location did not changed' do
        let(:params) { { lat: booking.driver.lat, lng: booking.driver.lng } }
        before { subject.execute }

        it 'does not update location_updated_at' do
          expect(booking.driver.location_updated_at).to eq previous_location_updated_at
        end
      end

      context 'location not present' do
        let(:params) { { lat: nil, lng: nil } }
        before { subject.execute }

        it 'does not update location_updated_at' do
          expect(booking.driver.location_updated_at).to eq previous_location_updated_at
        end
      end
    end
  end
end
