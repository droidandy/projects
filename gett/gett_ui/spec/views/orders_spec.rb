require 'rails_helper'

RSpec.describe :orders do
  let!(:now) { Time.current.to_datetime }
  let(:address1) { create :address, lat: 1, lng: 2, line: 'Address 1' }
  let(:address2) { create :address, lat: 1, lng: 2, line: 'Address 2' }
  let(:address3) { create :address, lat: 1, lng: 2, line: 'Address 3' }
  let(:salesman) { create :user, :sales, first_name: 'Sales', last_name: 'Man' }
  let(:company) do
    create :company,
      name: 'Company 1',
      run_in_fee: 10,
      booking_fee: 20,
      handling_fee: 30,
      address_id: address1.id,
      salesman_id: salesman.id
  end
  let(:contact) do
    create :contact, :without_address,
      company_id: company.id,
      email: 'contact@email.com',
      first_name: 'Company',
      last_name: 'Contact'
  end
  let(:booker) { create :booker, company: company, first_name: 'Book', last_name: 'Er' }
  let(:booking) do
    create :booking, :without_passenger,
      status: :completed,
      booker: booker,
      passenger_first_name: 'Pass',
      passenger_last_name: 'Anger',
      pickup_address: address2,
      destination_address: address3,
      created_at: now,
      updated_at: now,
      scheduled_at: now + 1.day,
      arrived_at: now,
      started_at: now,
      ended_at: now,
      cancelled_at: now,
      fare_cost: 1000,
      total_cost: 1100
  end
  let!(:payment) { create :payment, booking: booking, status: 'failed', error_description: 'some error' }

  before do
    create :booker_reference, booking: booking, booking_reference_name: 'Reference 1', value: 'Ref Val 1'
    create :booker_reference, booking: booking, booking_reference_name: 'Reference 2', value: 'Ref Val 2'
    company.company_info.update(contact_id: contact.id)
  end

  subject(:order) { DB[:orders].first }

  it 'has proper values' do
    expect(order[:cost_settled]).to                       be_nil
    expect(order[:cost_to_be_paid]).to                    be_nil
    expect(order[:total_fees]).to                         be_nil
    expect(order[:total_fare]).to                         be_nil
    expect(order[:final_cost_excl_vat]).to                eq 1000
    expect(order[:final_cost_incl_vat]).to                eq 1100
    expect(order[:company_id]).to                         eq company.id
    expect(order[:company_name]).to                       eq 'Company 1'
    expect(order[:company_address]).to                    eq 'Address 1'
    expect(order[:company_email]).to                      eq 'contact@email.com'
    expect(order[:company_contact_person]).to             eq 'Company Contact'
    expect(order[:company_account_manager]).to            eq 'Sales Man'
    expect(order[:company_charge_fees_on_credit_card]).to be_nil
    expect(order[:company_charge_fees_from_client]).to    be_nil
    expect(order[:company_business_type]).to              be_nil
    expect(order[:order_id]).to                           eq booking.id
    expect(order[:order_class]).to                        be_nil
    expect(order[:order_status]).to                       eq 'completed'
    expect(order[:order_created_at].to_i).to              eq now.to_i
    expect(order[:order_scheduled_at].to_i).to            eq((now + 1.day).to_i)
    expect(order[:order_arrived_at].to_i).to              eq now.to_i
    expect(order[:order_started_at].to_i).to              eq now.to_i
    expect(order[:order_ended_at].to_i).to                eq now.to_i
    expect(order[:order_cancelled_at].to_i).to            eq now.to_i
    expect(order[:order_origin_address]).to               eq 'Address 2'
    expect(order[:order_destination_address]).to          eq 'Address 3'
    expect(order[:order_dropoff_address]).to              be_nil
    expect(order[:order_driving_distance]).to             be_nil
    expect(order[:order_references]).to                   eq 'Reference 1' => 'Ref Val 1', 'Reference 2' => 'Ref Val 2'
    expect(order[:order_reason_for_travel]).to            be_nil
    expect(order[:order_fixed_price]).to                  be_nil
    expect(order[:order_taxi_meter]).to                   be_nil
    expect(order[:order_waiting_time]).to                 be_nil
    expect(order[:order_waiting_time_cost]).to            be_nil
    expect(order[:order_additional_cost]).to              be_nil
    expect(order[:order_extras_cost]).to                  be_nil
    expect(order[:order_cancellation_cost]).to            eq 5
    expect(order[:order_stop_point_cost]).to              be_nil
    expect(order[:order_gratuity_cost]).to                be_nil
    expect(order[:order_vat_fee]).to                      be_nil
    expect(order[:order_has_credit_card_debt]).to         be_nil
    expect(order[:order_credit_card_type]).to             be_nil
    expect(order[:order_credit_card_ending]).to           be_nil
    expect(order[:order_run_in_fee]).to                   eq 10
    expect(order[:order_booking_fee]).to                  eq 20
    expect(order[:order_handling_fee]).to                 eq 30
    expect(order[:riding_user_name]).to                   eq 'Pass Anger'
    expect(order[:riding_user_email]).to                  be_nil
    expect(order[:riding_user_employee_id]).to            be_nil
    expect(order[:riding_user_department]).to             be_nil
    expect(order[:ordering_user_name]).to                 eq 'Book Er'
    expect(order[:order_payment_type]).to                 eq 'account'
    expect(order[:order_payment_errors]).to               eq 'some error'
    expect(order[:order_payment_status]).to               eq 'failed'
  end

  context 'when passenger is present' do
    let(:department) { create :department, company: company, name: 'Dept' }
    let(:passenger) do
      create :passenger,
        email: 'passenger@email.com',
        company: company,
        first_name: 'Pass',
        last_name: 'Anger',
        department: department
    end

    before { booking.update(passenger_id: passenger.id, passenger_first_name: nil, passenger_last_name: nil) }

    it 'has proper values' do
      expect(order[:riding_user_name]).to        eq 'Pass Anger'
      expect(order[:riding_user_email]).to       eq 'passenger@email.com'
      expect(order[:riding_user_employee_id]).to eq passenger.id
      expect(order[:riding_user_department]).to  eq 'Dept'
    end
  end
end
