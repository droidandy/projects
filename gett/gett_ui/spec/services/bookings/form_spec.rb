require 'rails_helper'

RSpec.describe Bookings::Form, type: :service do
  let(:company)             { create :company }
  let(:passenger)           { create :passenger, company: company, first_name: 'Adam' }
  let!(:inactive_passenger) { create :passenger, company: company, active: false }
  let!(:travel_reason)      { create :travel_reason, company: company }
  let!(:booker)             { create :booker, company: company, passenger_pks: [passenger.id], first_name: 'Zorg' }
  let!(:booking_reference)  { create :booking_reference, company: company }

  it { is_expected.to be_authorized_by(Bookings::FormPolicy) }

  let(:service) { Bookings::Form.new }

  describe '#execute' do
    service_context { { member: booker, company: company } }

    it { is_expected.to use_policy_scope(:passengers) }

    describe 'result' do
      let(:passenger_json) do
        passenger.as_json(
          only: %i(
            id first_name last_name phone mobile default_vehicle
            cost_centre avatar_url default_phone_type
          ),
          include: %w(home_address work_address)
        ).merge(
          'avatar_versions' => passenger.avatar_versions.stringify_keys,
          'favorite_addresses' => [],
          'payment_cards' => [],
          'preferred_vendor_allowed' => false
        )
      end

      let(:booker_json) do
        booker.as_json(
          only: %i(
            id first_name last_name phone mobile default_vehicle cost_centre
            avatar_url default_phone_type
          ),
          include: %i(home_address work_address)
        ).merge(
          'avatar_versions' => booker.avatar_versions.stringify_keys,
          'favorite_addresses' => [],
          'payment_cards' => [],
          'preferred_vendor_allowed' => false
        )
      end

      let(:travel_reason_json) { travel_reason.as_json(only: %i(id name)) }

      let(:booking_reference_json) do
        booking_reference
          .as_json(only: %i(id name dropdown cost_centre conditional mandatory))
      end

      subject { service.execute.result.with_indifferent_access }

      it {
        is_expected.to include(
          :travel_reasons, :booking_references, :default_pickup_address,
          :can, :default_driver_message, :locations
        )
      }
      it { is_expected.not_to include(:booking) }

      context 'when member is not passenger' do
        it { is_expected.not_to include :passenger }
        its([:passengers]) { are_expected.to eq [passenger_json, booker_json] }
      end

      context 'when member is passenger' do
        service_context { { member: passenger, company: company } }

        it { is_expected.to include :passengers }
        its([:passengers]) { is_expected.to eq [passenger_json] }
        its([:passenger]) { is_expected.to eq passenger_json }
      end

      its([:travel_reasons]) { are_expected.to eq [travel_reason_json] }
      its([:booking_references]) { are_expected.to eq [booking_reference_json] }
      its([:default_pickup_address]) { is_expected.to eq company.address.as_json }
      its([:can]) do
        is_expected.to include(:select_passenger, :change_vehicle_count)
      end
      its([:default_driver_message]) { is_expected.to eq company.default_driver_message.as_json }

      context 'when booking present' do
        let(:service) { Bookings::Form.new(booking: booking) }
        let(:booking) { create(:booking, :scheduled, booker: booker) }

        it { expect(subject[:booking][:schedule]).to be nil }

        context 'when asap booking' do
          let(:booking) { create(:booking, :asap, booker: booker) }

          subject { service.execute.result }

          it { is_expected.to be nil }
        end

        context 'when recurring booking' do
          let(:booking) { create(:booking, :recurring, booker: booker) }

          subject { service.execute.result }

          it { expect(subject[:booking][:schedule]).to be_present }
          it { expect(subject[:booking][:scheduled_type]).to eq 'recurring' }
        end

        context 'when booking has cash payment method' do
          let(:booking) { create(:booking, :scheduled, :cash, booker: booker) }

          subject { service.execute.result }

          it { is_expected.not_to be nil }
        end

        context 'when passenger is guest' do
          let(:booking) { create(:booking, :scheduled, :without_passenger, booker: booker) }

          subject { service.execute.result }

          specify { expect(subject[:passenger]).to be_nil }
          specify { expect(subject[:passengers]).to be_empty }
        end
      end
    end
  end
end
