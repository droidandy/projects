require 'rails_helper'

RSpec.describe Bookings::References, type: :service do
  let(:company)            { create(:company) }
  let(:admin)              { create(:admin, company: company) }
  let!(:booking_reference) { create(:booking_reference, company: company) }
  let(:booking_reference_json) do
    booking_reference.as_json(only: [:id, :name, :dropdown, :cost_centre, :conditional, :mandatory])
  end

  it { is_expected.to be_authorized_by(Bookings::FormPolicy) }

  let(:service) { Bookings::References.new }

  describe '#execute' do
    service_context { { member: admin, company: company } }

    describe 'result' do
      subject { service.execute.result }

      it { is_expected.to eq [booking_reference_json] }

      context 'when booking_id is passed' do
        let(:booking) { create(:booking, company: company) }
        let(:service) { Bookings::References.new(booking_id: booking.id.to_s) }
        # ^ booking id is passed as string since it comes this way from params

        before do
          create(:booker_reference, booking: booking, booking_reference_name: booking_reference.name, value: 'foo')
        end

        let(:booking_reference_json) { super().merge('value' => 'foo') }

        it { is_expected.to eq [booking_reference_json] }
      end
    end
  end
end
