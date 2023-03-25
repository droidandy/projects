require 'rails_helper'

RSpec.describe Invoices::Export, type: :service do
  let(:account_manager) { create(:user, :sales, first_name: 'Homer', last_name: 'Simpson') }
  let(:booker)          { create(:admin, company: company, first_name: 'Book', last_name: 'Er') }
  let(:company_addr)    { create(:address, line: '77 Company Street') }
  let(:pickup_addr)     { create(:address, line: '1212, Pickup Street', timezone: 'America/Chicago') }
  let(:destin_addr)     { create(:address, line: '2121, Destination Street') }
  let(:work_role)       { create(:work_role, company: company, name: 'Work Role') }
  let(:department)      { create(:department, company: company, name: 'Dept') }
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
  let(:booking_1) do
    create(:booking, :completed,
      vehicle:             vehicle,
      booker:              booker,
      passenger:           passenger,
      pickup_address:      pickup_addr,
      destination_address: destin_addr,
      service_id:         'service-id-1',
      payment_method:     'account',
      fare_quote:         250,
      created_at:         '2017-09-07 12:00',
      scheduled_at:       '2017-09-07 12:00',
      ended_at:           '2017-09-07 13:00'
    )
  end
  let(:booking_2) do
    create(:booking, :cancelled,
      vehicle:              vehicle,
      booker:               booker,
      passenger:            nil,
      passenger_first_name: 'Guest',
      pickup_address:       pickup_addr,
      destination_address:  destin_addr,
      service_id:           'service-id-2',
      payment_method:       'account',
      created_at:           '2017-09-07 12:00',
      scheduled_at:         '2017-09-07 12:00',
      ended_at:             '2017-09-07 13:00'
    )
  end
  let(:invoice) { create(:invoice, company: company, booking_pks: [booking_1.id, booking_2.id]) }
  before do
    contact = create(:contact, company_id: company.id, email: 'contact@email.com', first_name: 'Company', last_name: 'Contact')
    company.company_info.update(contact_id: contact.id, cost_centre: 'cost centre')
    create(:booker_reference, booking: booking_1, value: 'Value 1', booking_reference_name: 'Ref1')
    create(:booker_reference, booking: booking_1, value: 'Value 2', booking_reference_name: 'Ref2')
    create(:booker_reference, booking: booking_1, value: 'Value 3', booking_reference_name: 'Ref3')
    create(:booker_reference, booking: booking_2, value: 'Value 4', booking_reference_name: 'Ref4')
    create(:booking_reference, company: company, name: 'Ref1')
    create(:booking_reference, company: company, name: 'Ref2')
    create(:booking_reference, company: company, name: 'Ref3')
    create(:booking_reference, company: company, name: 'Ref4')
    create(:booking_charges,
      booking:                booking_1,
      paid_waiting_time:      7835,
      run_in_fee:             200,
      fare_cost:              250,
      handling_fee:           300,
      booking_fee:            100,
      paid_waiting_time_fee:  50,
      phone_booking_fee:      100,
      cancellation_fee:       30,
      extra1:                 80,
      extra2:                 80,
      extra3:                 80,
      tips:                   100,
      vat:                    100,
      total_cost:             1000,
      vatable_ride_fees:      1,
      non_vatable_ride_fees:  2,
      service_fees:           3,
      vatable_extra_fees:     4,
      non_vatable_extra_fees: 5
    )
    create(:booking_charges,
      booking:                booking_2,
      paid_waiting_time:      0,
      run_in_fee:             0,
      fare_cost:              250,
      handling_fee:           0,
      booking_fee:            100,
      paid_waiting_time_fee:  0,
      phone_booking_fee:      100,
      cancellation_fee:       30,
      extra1:                 0,
      extra2:                 0,
      extra3:                 0,
      tips:                   0,
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

  let(:service) { Invoices::Export.new(invoice: invoice) }

  describe '#execute' do
    let(:csv_data) do
      #  Headers                             Booking_1 data                 Booking_2 data
      { 'Invoice Number'                  => [invoice.id,                   invoice.id                  ],
        'Company Cost Center'             => ['cost centre',                'cost centre'               ],
        'Service ID'                      => ['service-id-1',               'service-id-2'              ],
        'Status'                          => ['completed',                  'cancelled'                 ],
        'Created At'                      => ['07/09/2017 07:00',           '07/09/2017 07:00'          ],
        'Scheduled At'                    => ['07/09/2017 07:00',           '07/09/2017 07:00'          ],
        'Arrived At'                      => ['',                           ''                          ],
        'Started At'                      => ['',                           ''                          ],
        'Ended At'                        => ['07/09/2017 08:00',           '07/09/2017 08:00'          ],
        'Cancelled At'                    => ['',                           ''                          ],
        'Vendor'                          => ['gett',                       'gett'                      ],
        'Car Type'                        => ['Car',                        'Car'                       ],
        'Riding User Name'                => ['Pass Anger',                 'Guest '                    ],
        'Riding User Email'               => ['pass@email.com',             ''                          ],
        'Riding User Payroll ID'          => ['Test Payroll ID',            ''                          ],
        'Riding User Division'            => ['Test Division',              ''                          ],
        'Riding User Work Role'           => ['Work Role',                  ''                          ],
        'Riding User Department'          => ['Dept',                       ''                          ],
        'Riding User Employee ID'         => [passenger.id,                 ''                          ],
        'Ordering User Name'              => ['Book Er',                    'Book Er'                   ],
        'Ref1'                            => ['Value 1',                    ''                          ],
        'Ref2'                            => ['Value 2',                    ''                          ],
        'Ref3'                            => ['Value 3',                    ''                          ],
        'Ref4'                            => ['',                           'Value 4'                   ],
        'Reason For Travel'               => ['',                           ''                          ],
        'Origin Address'                  => ['"1212, Pickup Street"',      '"1212, Pickup Street"'     ],
        'Destination Address'             => ['"2121, Destination Street"', '"2121, Destination Street"'],
        'Payment Type'                    => ['account',                    'account'                   ],
        'Ride Cost (VATable)'             => ['0.00',                       '0.00'                      ],
        'Ride Cost (Non-VATable)'         => ['2.50',                       '0.00'                      ],
        'Waiting Time'                    => ['02:10:35',                   '00:00:00'                  ],
        'Waiting Time Cost (VATable)'     => ['0.00',                       '0.00'                      ],
        'Waiting Time Cost (Non-VATable)' => ['0.50',                       '0.00'                      ],
        'Cancellation Cost'               => ['0.30',                       '0.30'                      ],
        'Run-in Fee'                      => ['2.00',                       '0.00'                      ],
        'Booking Fee'                     => ['1.00',                       '1.00'                      ],
        'Phone Booking Fee'               => ['1.00',                       '1.00'                      ],
        'Handling Fee'                    => ['3.00',                       '0.00'                      ],
        'International Fee'               => ['0.00',                       '0.00'                      ],
        'Extra Charge 1'                  => ['0.80',                       '0.00'                      ],
        'Extra Charge 2'                  => ['0.80',                       '0.00'                      ],
        'Extra Charge 3'                  => ['0.80',                       '0.00'                      ],
        'Total Fees'                      => ['11.20',                      '2.30'                      ],
        'Total VATable'                   => ['0.08',                       '0.08'                      ],
        'Total Non-VATable'               => ['0.07',                       '0.07'                      ],
        'VAT'                             => ['1.00',                       '1.00'                      ],
        'Total Cost Incl VAT'             => ['10.00',                      '10.00'                     ] }
    end

    it 'executes successfully' do
      expect{ service.execute }.not_to raise_error
      rows = service.result.split("\n")
      expect(rows[0]).to eq csv_data.keys.join(',')
      # there is no specific ordering on rows, hence using `match_array` to avoid
      # intermittent failures
      expect(rows[1, 2]).to match_array([
        csv_data.values.map(&:first).join(','), csv_data.values.map(&:second).join(',')
      ])
    end

    context 'when booking addresses has to be sanitized' do
      service_context { {front_office: true, sanitize_home_address: true} }

      before { booking_1.booking_addresses.find(&:pickup?).update(passenger_address_type: 'home') }

      it 'has sanitized home address in report' do
        csv = CSV.parse(service.execute.result, headers: true)
        row = csv.find { |r| r['Service ID'] == 'service-id-1' }
        expect(row['Origin Address']).to eq('Home')
      end
    end

    context 'non-completed booking with zero price' do
      let(:booking) { create(:booking, :cancelled) }
      let(:invoice) { create(:invoice, company: company, booking_pks: [booking.id]) }

      before do
        create(:booking_charges, booking: booking, total_cost: 0)
      end

      it 'excludes booking from csv' do
        expect{ service.execute }.not_to raise_error
        expect(service.result.split("\n").count).to eq(1)
      end
    end

    context 'bookings in multiple invoices' do
      before do
        create(:invoice, company: company, booking_pks: [booking_1.id, booking_2.id])
      end

      it 'does not duplicate rows' do
        expect{ service.execute }.not_to raise_error
        expect(service.result.split("\n").count).to eq(3)
      end
    end
  end
end
