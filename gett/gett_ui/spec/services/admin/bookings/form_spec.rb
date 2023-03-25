require 'rails_helper'

RSpec.describe Admin::Bookings::Form, type: :service do
  let(:admin)   { create(:admin) }
  let(:company) { create(:company) }
  let(:booker)  { create(:booker, company: company) }
  let(:booking) { create(:booking, :completed, booker: booker, company: company) }

  service_context { {admin: admin} }

  subject(:service) { Admin::Bookings::Form.new(booking: booking, repeat: true) }

  describe '#execute' do
    let(:form_service) do
      double(
        'Shared::Bookings::Form',
        success?: true,
        result: {booking: :data},
        passengers_data: [],
        can_change_details?: true,
        can_change_vehicle_count?: true
      )
    end

    it 'delegates to Shared::Bookings::Form' do
      expect(booking.company).to receive(:passengers_dataset).and_return(:passengers_dataset)
      expect(form_service).to receive(:execute).and_return(form_service)
      expect(form_service).to receive(:passenger_data).and_return(id: 1)

      expect(Shared::Bookings::Form).to receive(:new)
        .with(
          booking: booking,
          company: company,
          passengers_dataset: :passengers_dataset,
          back_office: true,
          allow_personal_cards: true,
          repeating_booking: true,
          details_editable_due_status: true
        )
        .and_return(form_service)

      expect(service.execute).to be_success
      expect(service.result).to eq(
        booking: :data,
        can: {
          select_preferred_vendor: true,
          select_passenger: true,
          select_booker: false,
          change_vehicle_count: true,
          change_references: true
        },
        passengers: [],
        passenger: { id: 1, phone_number: booking.passenger.phone },
        bookers: [{ id: booker.id, first_name: booker.first_name, last_name: booker.last_name }.stringify_keys]
      )
    end

    context 'when Guest passenger' do
      let(:booking) { create(:booking, :completed, :without_passenger, booker: booker, company: company) }

      it 'delegates to Shared::Bookings::Form' do
        expect(booking.company).to receive(:passengers_dataset).and_return(:passengers_dataset)
        expect(form_service).to receive(:execute).and_return(form_service)
        expect(booking).to receive(:passenger_info).and_return(phone_number: '123')

        expect(Shared::Bookings::Form).to receive(:new)
          .with(
            booking: booking,
            company: company,
            passengers_dataset: :passengers_dataset,
            back_office: true,
            allow_personal_cards: true,
            repeating_booking: true,
            details_editable_due_status: true
          )
          .and_return(form_service)

        expect(service.execute).to be_success
        expect(service.result).to eq(
          booking: :data,
          can: {
            select_preferred_vendor: true,
            select_passenger: true,
            select_booker: false,
            change_vehicle_count: true,
            change_references: true
          },
          passengers: [],
          passenger: { phone_number: '123' },
          bookers: [{ id: booker.id, first_name: booker.first_name, last_name: booker.last_name }.stringify_keys]
        )
      end
    end

    context 'when booking has cash payment method' do
      let(:booking) { create(:booking, :scheduled, :cash) }

      subject { service.execute.result }

      it { is_expected.to be nil }
    end
  end
end
