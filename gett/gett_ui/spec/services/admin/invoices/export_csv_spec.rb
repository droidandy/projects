require 'rails_helper'

RSpec.describe Admin::Invoices::ExportCSV do
  let(:account_manager)   { create(:user, :sales, first_name: 'Homer', last_name: 'Simpson') }
  let(:booker)            { create(:admin, company: company, first_name: 'Book', last_name: 'Er') }
  let(:company_addr)      { create(:address, line: '77 Company Street', timezone: 'America/Chicago') }
  let(:pickup_addr)       { create(:address, line: '1212, Pickup Street', timezone: 'America/Chicago') }
  let(:destin_addr)       { create(:address, line: '2121, Destination Street', timezone: 'America/Chicago') }
  let(:work_role)         { create(:work_role, company: company, name: 'Work Role') }
  let(:department)        { create(:department, company: company, name: 'Dept') }
  let(:company) do
    create(:company,
      name:               'Spec Company',
      account_manager_id: account_manager.id,
      address_id:         company_addr.id,
      invoicing_schedule: 'monthly',
      payment_terms:      30,
      run_in_fee:         2.0
    )
  end
  let(:passenger) do
    create(:passenger,
      company:       company,
      first_name:    'Pass',
      last_name:     'Anger',
      email:         'pass@email.com',
      work_role_id:  work_role.id,
      department_id: department.id
    )
  end
  let(:vehicle) { create(:vehicle, :gett, name: 'Car') }
  let(:booking) do
    create(:booking, :completed,
      vehicle:             vehicle,
      booker:              booker,
      passenger:           passenger,
      pickup_address:      pickup_addr,
      destination_address: destin_addr,
      payment_method:     'account',
      fare_quote:         250,
      created_at:         '2017-09-07 12:00',
      scheduled_at:       '2017-09-07 12:00',
      ended_at:           '2017-09-07 13:00'
    )
  end
  let!(:invoice) { create(:invoice, company: company, booking_pks: [booking.id]) }
  before do
    contact = create(:contact, company_id: company.id, email: 'contact@email.com', first_name: 'Company', last_name: 'Contact')
    company.company_info.update(contact_id: contact.id, cost_centre: 'cost centre')
    create(:booker_reference, booking: booking, value: 'Value', booking_reference_name: 'Ref1')
    create(:booking_charges,
      booking:                booking,
      paid_waiting_time:      3700,
      run_in_fee:             200,
      fare_cost:              250,
      handling_fee:           300,
      booking_fee:            100,
      paid_waiting_time_fee:  50,
      phone_booking_fee:      100,
      cancellation_fee:       30,
      tips:                   100,
      vat:                    100,
      total_cost:             1000,
      vatable_ride_fees:      1,
      non_vatable_ride_fees:  2,
      service_fees:           3,
      vatable_extra_fees:     4,
      non_vatable_extra_fees: 5
    )
  end

  # block bellow to generate a booking with references, which SHOULD NOT affect set
  # of resulting columns
  before do
    company = create(:company)
    booking = create(:booking, company: company)
    create(:booking_reference, company: company, name: 'Unrelated Reference')
    create(:booker_reference, booking: booking, value: 'Unrelated Value', booking_reference_name: 'Unrelated Reference')
  end

  let(:period)  { Time.current.strftime("%Y %B") }
  let(:service) { Admin::Invoices::ExportCSV.new(periods: [period]) }

  describe '#execute' do
    let(:csv_data) do
      {
        'Company ID'                      => company.id,
        'Invoice Number'                  => invoice.id,
        'Company Cost Center'             => 'cost centre',
        'Service ID'                      => 'service-id',
        'Status'                          => 'completed',
        'Created At'                      => '07/09/2017 07:00',
        'Scheduled At'                    => '07/09/2017 07:00',
        'Arrived At'                      => '',
        'Started At'                      => '',
        'Ended At'                        => '07/09/2017 08:00',
        'Cancelled At'                    => '',
        'Vendor'                          => 'gett',
        'Car Type'                        => 'Car',
        'Riding User Name'                => 'Pass Anger',
        'Riding User Email'               => 'pass@email.com',
        'Riding User Payroll ID'          => 'Test Payroll ID',
        'Riding User Division'            => 'Test Division',
        'Riding User Work Role'           => 'Work Role',
        'Riding User Department'          => 'Dept',
        'Riding User Employee ID'         => passenger.id,
        'Ordering User Name'              => 'Book Er',
        'Ref1'                            => 'Value',
        'Reason For Travel'               => '',
        'Origin Address'                  => '"1212, Pickup Street"',
        'Destination Address'             => '"2121, Destination Street"',
        'Payment Type'                    => 'account',
        'Ride Cost (VATable)'             => '0.00',
        'Ride Cost (Non-VATable)'         => '2.50',
        'Waiting Time'                    => '01:01:40',
        'Waiting Time Cost (VATable)'     => '0.00',
        'Waiting Time Cost (Non-VATable)' => '0.50',
        'Cancellation Cost'               => '0.30',
        'Run-in Fee'                      => '2.00',
        'Booking Fee'                     => '1.00',
        'Phone Booking Fee'               => '1.00',
        'Handling Fee'                    => '3.00',
        'International Fee'               => '0.00',
        'Extra Charge 1'                  => '0.00',
        'Extra Charge 2'                  => '0.00',
        'Extra Charge 3'                  => '0.00',
        'Total Fees'                      => '8.80',
        'Total VATable'                   => '0.08',
        'Total Non-VATable'               => '0.07',
        'VAT'                             => '1.00',
        'Total Cost Incl VAT'             => '10.00'
      }
    end

    it 'executes successfully' do
      expect{ service.execute }.not_to raise_error
      expect(service.result).to include(csv_data.keys.join(','))
      expect(service.result).to include(csv_data.values.join(','))
    end
  end
end
