require 'rails_helper'

RSpec.describe Bookings::Export, type: :service do
  it { is_expected.to be_authorized_by(Bookings::IndexPolicy) }

  describe '#execute' do
    service_context { { member: booker } }

    let(:booker)  { create(:booker, company: company) }
    let(:company) { create(:company) }

    subject(:service) { Bookings::Export.new }

    it { is_expected.to use_policy_scope }

    describe 'execution' do
      before { service.execute }

      it { is_expected.to be_success }
    end

    describe 'result' do
      let!(:other_booking) { create(:booking, booker: booker) }

      let!(:booker_reference) do
        create(:booker_reference,
          booking_reference_name: 'Booking Ref 1',
          booking: completed_booking,
          value: 1234
        )
      end

      let!(:booking_charges) do
        create(:booking_charges,
          booking: completed_booking,
          total_cost: 120,
          vat: 10
        )
      end

      let(:passenger) do
        create(:passenger,
          first_name: 'Dwaine',
          last_name: 'Carter',
          department: create(:department, company: company, name: 'New York Police Department'),
          work_role: create(:work_role, company: company, name: 'SWAT Lead'),
          cost_centre: 'Cost Centre No.1',
          division: 'Division No.1',
          phone: '+0712341234',
          payroll: '1234'
        )
      end

      let!(:completed_booking) do
        create(:booking,
          service_id: '6',
          booker: booker,
          status: :completed,
          message: 'This is a message',
          passenger: passenger,
          created_at: Time.new(2001, 1, 31, 14, 20, 0, '+02:00'),
          scheduled_at: Time.new(2001, 3, 31, 14, 20, 0, '+02:00'),
          cancelled_by: create(:member, first_name: 'Lil', last_name: 'Wayne'),
          payment_method: 'cash'
        )
      end

      subject(:csv_row) { CSV.parse(service.execute.result, headers: true).first.to_h }

      it 'contains valid headers and data' do
        expect(csv_row).to eq(
          "Id" => "6",
          "Created at" => "31/01/2001 12:20",
          "Message to driver" => "This is a message",
          "Status" => "Completed",
          "Cancellation" => "0.0",
          "Total cost" => "1.2",
          "Total cost excl. VAT" => "1.1",
          "Passenger name" => "Dwaine Carter",
          "Passenger phone" => "+0712341234",
          "Pickup address" => completed_booking.pickup_address.line,
          "Destination address" => completed_booking.destination_address.line,
          "Vehicle type" => completed_booking.vehicle.name,
          "Booker name" => booker.full_name,
          "References" => "Booking Ref 1: 1234",
          "Travel reason" => "Other",
          "Scheduled at" => "31/03/2001 13:20",
          "Driver name" => nil,
          "Driver rating" => nil,
          "Department" => "New York Police Department",
          "Work role" => "SWAT Lead",
          "Cancelled by" => "Lil Wayne",
          "Payroll ID" => "1234",
          "Cost centre" => "Cost Centre No.1",
          "Division" => "Division No.1",
          "Payment type" => "cash"
        )
      end

      context 'when booking address is passenger home address' do
        service_context { {front_office: true, sanitize_home_address: true} }

        before do
          completed_booking.booking_addresses.find(&:pickup?).update(passenger_address_type: 'home')
          completed_booking.booking_addresses.find(&:destination?).update(passenger_address_type: 'home')
        end

        it 'contains sanitized home addresses' do
          expect(csv_row).to include(
            'Pickup address'      => 'Home',
            'Destination address' => 'Home'
          )
        end
      end
    end
  end
end
