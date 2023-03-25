require 'rails_helper'

RSpec.describe Documents::Invoice, type: :service do
  let(:company)       { create(:company) }
  let(:booker)        { create(:admin, company: company) }
  let(:gett_booking)  { create(:booking, :gett, :completed, booker: booker, fare_quote: 250) }
  let(:ot_booking)    { create(:booking, :ot, :completed, booker: booker, fare_quote: 300) }
  let(:get_e_booking) { create(:booking, :get_e, :completed, booker: booker, fare_quote: 200) }
  let(:carey_booking) { create(:booking, :carey, :completed, booker: booker, fare_quote: 200) }
  let(:free_booking)  { create(:booking, :gett, :completed, booker: booker, fare_quote: 0, service_id: 'free') }
  let(:booking_pks)   { [gett_booking, ot_booking, get_e_booking, carey_booking, free_booking].map(&:id) }

  let(:invoice) do
    create(
      :invoice,
      company: company,
      booking_pks: booking_pks,
      amount_cents: 2800,
      business_credit_cents: 500,
      created_at: Time.parse('2018-08-20 10:00:00 +01:00'),
      billing_period_start: Time.parse('2018-09-01 00:00:00 +01:00'),
      billing_period_end: Time.parse('2018-09-30 23:59:59 +01:00'),
      overdue_at: Time.parse('2018-10-10 23:59:59 +01:00')
    )
  end
  let(:service) { Documents::Invoice.new(invoice_id: invoice.id) }

  service_context { { user: create(:user, :admin), back_office: true } }

  before do
    create(:booking_charges,
      booking:               gett_booking,
      fare_cost:              250,
      handling_fee:           300,
      booking_fee:            100,
      paid_waiting_time_fee:  50,
      phone_booking_fee:      0,
      tips:                   100,
      vat:                    100,
      total_cost:             900,
      vatable_ride_fees:      1,
      non_vatable_ride_fees:  2,
      service_fees:           3,
      vatable_extra_fees:     4,
      non_vatable_extra_fees: 5
    )

    create(:booking_charges,
      booking:               ot_booking,
      fare_cost:             300,
      handling_fee:          300,
      booking_fee:           100,
      paid_waiting_time_fee: 50,
      phone_booking_fee:     50,
      tips:                  100,
      vat:                   100,
      extra1:                100,
      total_cost:            1100
    )

    create(:booking_charges,
      booking:               get_e_booking,
      fare_cost:             200,
      handling_fee:          100,
      booking_fee:           200,
      paid_waiting_time_fee: 50,
      phone_booking_fee:     50,
      tips:                  50,
      vat:                   50,
      total_cost:            800
    )

    create(:booking_charges,
      booking:               carey_booking,
      fare_cost:             200,
      handling_fee:          100,
      booking_fee:           200,
      run_in_fee:            50,
      phone_booking_fee:     50,
      tips:                  50,
      vat:                   0,
      total_cost:            650
    )

    create(:booking_charges,
      booking:               free_booking,
      total_cost:            0
    )
  end

  it 'displays free completed bookings' do
    expect(service.send(:decorated_bookings).map(&:order_id)).to include(free_booking.order_id)
  end

  describe '#template_assigns' do
    subject { service.send(:template_assigns) }

    it {
      is_expected.to eq(
        company:             company,
        contact:             company.admin,
        invoice:             invoice,
        invoice_date:        '20 Aug 2018',
        invoice_due_date:    '10 Oct 2018',
        invoice_status:      'Overdue',
        invoice_period:      'from 1 Sep 2018 to 30 Sep 2018',
        number_of_jobs:      5,
        net_non_vatable:     7,
        net_vatable:         8,
        vat:                 250,
        total:               3450,
        due:                 2800,
        promotions:          500,
        support_phone:       '+1234567890'
      )
    }
  end

  describe 'rendered OTE company address' do
    subject(:invoice_content) { Documents::Invoice.new(invoice: invoice, format: :html).execute.result }

    let(:address) { create(:address) }
    let(:company) { create(:company, address_id: address.id) }

    before do
      create(:companyadmin, company: company)
    end

    context 'for new invoices' do
      before { stub_const('DocumentsHelper::INVOICE_OTE_ADDRESS_CHANGE_DATE', '2018-08-01'.to_date) }

      it 'renders new OTE company address' do
        expect(invoice_content).to include('1 Plough Place, London EC4A 1DE')
      end
    end

    context 'for old invoices' do
      before { stub_const('DocumentsHelper::INVOICE_OTE_ADDRESS_CHANGE_DATE', '2018-08-21'.to_date) }

      it 'renders old OTE company address' do
        expect(invoice_content).to include('3rd Floor, Seal House, 1 Swan Lane, London, EC4R 3TN')
      end
    end
  end
end
