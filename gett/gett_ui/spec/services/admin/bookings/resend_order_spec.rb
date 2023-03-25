require 'rails_helper'

RSpec.describe Admin::Bookings::ResendOrder, type: :service do
  let(:company)    { create(:company) }
  let(:admin)      { create(:admin, company: company) }
  let(:vehicle)    { create(:vehicle, :gett) }
  let(:passenger)  { create(:passenger, company: admin.company) }
  let!(:booking)   { create(:booking, booker: admin, passenger: passenger, vehicle: vehicle) }

  subject(:service) { described_class.new(booking: booking) }

  service_context { { company: company } }

  describe '#execute' do
    before do
      allow(CreateBookingRequestWorker).to receive(:perform_async).with(booking.id)
    end

    it 'runs CreateBookingRequestWorker' do
      expect(CreateBookingRequestWorker).to receive(:perform_async).with(booking.id)

      service.execute
    end

    it 'does not create new Bookings' do
      expect{ service.execute }.not_to change(Booking, :count)
    end

    describe 'faye notification' do
      context 'when enterprise company' do
        specify 'notification should not be sent' do
          expect(Faye.bookings).not_to receive(:notify_create)
          service.execute
        end
      end

      context 'when affiliate company' do
        let!(:booking) { create(:booking, :without_passenger, booker: admin, vehicle: vehicle) }
        let(:company)  { create(:company, :affiliate) }

        it 'notification should be sent' do
          expect(Faye.bookings).to receive(:notify_create).with(instance_of(Booking))
          service.execute
        end
      end
    end

    context 'when there is splyt booking' do
      let!(:booking) { create(:booking, :splyt) }

      let(:estimate_updater) { double(:estimate_updater) }

      it 'calls Splyt::UpdateEstimate' do
        expect(Splyt::UpdateEstimate).to receive(:new).and_return(estimate_updater)
        expect(estimate_updater).to receive(:execute).and_return(double(success?: true))

        service.execute
      end
    end
  end
end
