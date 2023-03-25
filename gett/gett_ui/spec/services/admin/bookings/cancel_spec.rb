require 'rails_helper'

RSpec.describe Admin::Bookings::Cancel, type: :service do
  let(:admin)   { create(:admin) }
  let(:booker)  { create(:booker) }
  let(:booking) { create(:booking, status: 'order_received') }
  let(:params)  { {cancellation_fee: true} }

  service_context { {admin: admin} }

  subject(:service) do
    Admin::Bookings::Cancel.new(booking: booking, params: params)
  end

  describe '#execute' do
    it 'delegates to Shared::Bookings::Cancel' do
      expect(Shared::Bookings::Cancel).to receive(:new)
        .with(
          booking: booking,
          params: params,
          cancelled_by: admin,
          cancelled_through_back_office: true
        )
        .and_return(double(execute: double(success?: true), result: true))

      expect(service.execute).to be_success
    end

    context 'when internal service fails' do
      it 'sets errors correspondingly' do
        expect(Shared::Bookings::Cancel).to receive(:new)
          .and_return(double(execute: double(success?: false), result: false, errors: {api: 'error'}))

        expect(service.execute).not_to be_success
        expect(service.errors).to eq(api: 'error')
      end
    end
  end

  describe '#booking_data' do
    it 'delegates to Bookings::Show' do
      show_service = double('Admin::Bookings::Show')
      expect(Admin::Bookings::Show).to receive(:new).with(booking: booking).and_return(show_service)
      expect(show_service).to receive_message_chain(:execute, :result).and_return(:booking_data)

      expect(service.booking_data).to eq :booking_data
    end
  end
end
