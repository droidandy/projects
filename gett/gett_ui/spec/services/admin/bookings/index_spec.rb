require 'rails_helper'

RSpec.describe Admin::Bookings::Index, type: :service do
  describe '#execute' do
    subject(:result) { service.execute.result }

    context 'when fetching data for bookings list' do
      let!(:company_1) { create(:company, name: 'company_1') }
      let!(:company_2) { create(:company, name: 'a_company_2') }
      let!(:company_3) { create(:company, name: 'company_3') }
      let!(:company_4) { create(:company, name: 'company_4') }
      let(:booker)     { create(:admin, company: company_1) }
      let(:service)    { Admin::Bookings::Index.new }

      let!(:booking_1) { create_booking(:order_received) }
      let!(:booking_2) { create_booking(:locating) }
      let!(:booking_3) { create_booking(:in_progress) }
      let!(:booking_4) { create_booking(:completed) }
      let!(:booking_5) { create_booking(:ot) }

      it 'has counts of active and future orders and companies data' do
        is_expected.to include(counts: {active: 2, future: 2, alert: 0, critical: 0})
      end

      it 'has companies data ordered by name' do
        expect(result[:companies].map{ |c| c[:id] }).to eq([company_2.id, company_1.id, company_3.id, company_4.id])
      end

      it 'has all bookings in :items' do
        expect(result[:items].pluck('id')).to match_array(
          [booking_1.id, booking_2.id, booking_3.id, booking_4.id, booking_5.id]
        )
      end

      it 'has vendors data' do
        expect(result[:vendors_list]).to match_array([booking_1.vendor_name, nil])
      end
    end

    context "when fetching data for invoice's credit note" do
      let(:company) { create(:company) }
      let(:booker)  { create(:admin, company: company) }
      let(:invoice) { create(:invoice, company: company) }
      let(:service) { Admin::Bookings::Index.new(invoice_id: invoice.id) }

      let!(:booking) { create_booking(:completed) }

      before do
        create_booking
        create(:booking_charges, booking: booking)
        invoice.update(booking_pks: [booking.id])
      end

      it 'contains information only for bookings related to specified invoice' do
        expect(result[:items].pluck('id')).to eq([booking.id])
      end

      it 'contains booking charges information' do
        expect(result[:items][0][:charges]).to be_present
      end
    end

    def create_booking(*traits, **params)
      create(:booking, :without_passenger, *traits, booker: booker, **params)
    end
  end
end
