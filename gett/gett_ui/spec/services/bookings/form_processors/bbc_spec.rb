require 'rails_helper'

RSpec.describe Bookings::FormProcessors::Bbc, type: :service do
  # TODO: move logic to factory-bbc
  let(:company) do
    create(
      :company,
      :bbc,
      booking_fee: 1.5,
      travel_policy_mileage_limit: 40,
      excess_cost_per_mile: 1.0,
      p11d: 65
    )
  end

  let(:passenger) { create(:passenger, :bbc_freelancer, :pd_accepted, company: company) }

  let(:booking_params) do
    {
      vehicle_vendor_id: '',
      message: '',
      passenger_id: passenger.id&.to_s,
      passenger_name: passenger.full_name,
      passenger_phone: passenger.phone,
      travel_reason_id: '',
      scheduled_at: nil,
      scheduled_type: 'now',
      payment_method: 'account',
      payment_card_id: nil,
      payment_type: 'account',
      special_requirements: [],
      pickup_address: {
        postal_code: 'SW7 4ES',
        lat: 51.4950863,
        lng: -0.1845045,
        line: '112 Cromwell Rd, Kensington, London SW7 4ES, UK',
        country_code: 'GB',
        timezone: 'Europe/London',
        city: 'London'
      },
      destination_address: {
        postal_code: 'W1D 2HL',
        lat: 51.5158963,
        lng: -0.1352122,
        line: '113 Oxford St, Soho, London W1D 2HL, UK',
        country_code: 'GB',
        timezone: 'Europe/London',
        city: 'London'
      },
      booker_references: [],
      schedule: {
        custom: false,
        preset_type: 'daily',
        recurrence_factor: '1',
        weekdays: [],
        scheduled_ats: []
      }
    }
  end

  let(:vehicles_data_params) do
    {
      vehicles: [
        {
          name: 'Standard',
          value: 'Saloon_Standard',
          quote_id: '87171',
          price: 17000.0,
          eta: '< 30',
          available: true,
          earliest_available_in: 60,
          service_type: 'ot',
          description: 'Safe and reliable vehicle',
          details: ['First 10 mins wait time is free']
        }
      ]
    }
  end

  let(:params) do
    {
      booking_params: booking_params,
      errors: {},
      alerts: {},
      vehicles_data: vehicles_data_params
    }
  end

  let(:passenger_home_address) { create(:address) }
  let(:passenger_work_address) { create(:address) }

  subject(:service) { described_class.new(company: company, **params) }
  subject(:service_result) { service.result }
  # in this spec we have only one vehicle in result
  subject(:vehicle_data_result) do
    vehicles_data_params[:vehicles].first.slice(
      :bbc_p11_tax, :bbc_total_cost, :bbc_salary_charge, :bbc_total_cost_to_bbc
    )
  end
  subject(:metadata_result) { service_result[:metadata] }

  before do
    create(:travel_reason, :hw, company: company)
    create(:travel_reason, :wh, company: company)
    create(:travel_reason, :ww, company: company)
    allow_any_instance_of(Member).to receive(:home_address).and_return(passenger_home_address)
    allow_any_instance_of(Member).to receive(:work_address).and_return(passenger_work_address)
  end

  describe '#execute' do
    def stub_outside_lnemt(out_lnemt)
      # TODO: use direct time check instead of stub
      allow(service).to receive(:outside_lnemt?).and_return(out_lnemt)
    end

    def stub_outside_limit(out_limit)
      # travel_policy_mileage_limit: 40
      ride_distance = out_limit ? 80 : 10
      allow(service).to receive(:ride_distance).and_return(ride_distance)
    end

    def stub_exemption_whhw_salary_charge(enabled)
      allow_any_instance_of(Member).to receive(:exemption_wh_hw_charges).and_return(enabled)
    end

    def stub_exemption_ww_salary_charge(enabled)
      allow_any_instance_of(Member).to receive(:exemption_ww_charges).and_return(enabled)
    end

    def stub_exemption_p11d(enabled)
      allow_any_instance_of(Member).to receive(:exemption_p11d).and_return(enabled)
    end

    before do
      allow(service).to receive(:ride_distance).and_return(10)
      allow(service).to receive(:airport_location_match?).and_return(false)
    end

    describe 'international rules' do
      before do
        booking_params.merge!(
          international_flag: true,
          journey_type: Booking::BBC::JourneyType::WH
        )
        service.execute
      end

      it 'sets journey type to WW' do
        expect(service.result[:booking_params][:journey_type]).to eq(Booking::BBC::JourneyType::WW)
      end

      it 'applies all costs to BBC' do
        expect(vehicle_data_result).to eq(
          bbc_total_cost_to_bbc: 17150.0,
          bbc_salary_charge: 0,
          bbc_p11_tax: 0
        )
      end
    end

    describe 'guest passenger' do
      let(:passenger) { build(:passenger) }

      it 'should not add alerts if outside limit' do
        stub_outside_limit(true)
        expect(service).not_to receive(:add_excess_mileage_error)
        service.execute
      end

      it 'should not add alerts if inside limit' do
        stub_outside_limit(false)
        expect(service).not_to receive(:add_excess_mileage_error)
        service.execute
      end
    end

    describe 'freelancer rules' do
      let(:passenger) { create(:passenger, :bbc_freelancer, company: company) }

      it 'calculates vehicle cost' do
        service.execute

        expect(vehicle_data_result).to include(bbc_total_cost: 17150.0)
      end
    end

    describe 'temp pd rules' do
      let(:passenger) { create(:passenger, :bbc_temp_pd, company: company) }

      context 'pd expired' do
        let(:passenger) do
          create(:passenger, :bbc_temp_pd,
            pd_accepted_at: nil,
            pd_expires_at: 2.months.ago,
            company: company
          )
        end

        it 'adds alert' do
          service.execute

          expect(service_result[:errors]).to include(base: [I18n.t('bookings.form_processors.bbc.no_passenger_declaration_found')])
        end
      end

      context 'ww ride' do
        before do
          allow(service).to receive(:wh_ride?).and_return(false)
          allow(service).to receive(:hw_ride?).and_return(false)
          allow(service).to receive(:ww_ride?).and_return(true)
        end

        expectations = [
          # outside_limit alert_type                    vehicle_cost_calc
          #        exemp_salary_enabled          metadata                                                                                             vehicle_cost_calc
          [ false, false, false,                 false, { bbc_total_cost: 17150.0 } ],
          [ false, true,  false,                 false, { bbc_total_cost: 17150.0 } ],
          [ true,  false, :excess_mileage_error, false, {} ],
          [ true,  true,  :excess_mileage_error, false, {} ]
        ]

        expectations.each_with_index do |(outside_limit, exemption_salary_charge_enabled, alert_type, _metadata, vehicle_cost_calculation), line|
          it "checks expectations from line #{line + 1}" do
            stub_outside_limit(outside_limit)
            stub_exemption_ww_salary_charge(exemption_salary_charge_enabled)

            if alert_type.present?
              expect(service).to receive("add_#{alert_type}").and_call_original
            end

            service.execute

            # TODO: temporary disable notifications by request from BBC
            # should be enabled after testing finish
            # if metadata.present?
            #   expect(metadata_result).to eq(metadata)
            # end

            expect(vehicle_data_result).to include(vehicle_cost_calculation)
          end
        end
      end
    end

    describe 'thin pd rules' do
      let(:passenger) { create(:passenger, :bbc_thin_pd, :pd_accepted, company: company) }

      context 'pd expired' do
        let(:passenger) { create(:passenger, :bbc_thin_pd, pd_expires_at: 1.year.ago, company: company) }

        it 'adds alert' do
          service.execute

          expect(service_result[:errors]).to include(base: [I18n.t('bookings.form_processors.bbc.no_passenger_declaration_found')])
        end
      end

      context 'ww ride' do
        before do
          allow(service).to receive(:wh_ride?).and_return(false)
          allow(service).to receive(:hw_ride?).and_return(false)
          allow(service).to receive(:ww_ride?).and_return(true)
        end

        expectations = [
          # outside_limit alert_type
          #        exemp_salary_enabled          metadata                                                                                             vehicle_cost_calc
          [ false, false, false,                 false,                                                                                               { bbc_total_cost: 17150.0 } ],
          [ false, true,  false,                 false,                                                                                               { bbc_total_cost: 17150.0 } ],
          [ true,  false, :excess_mileage_alert, { ride_over_mileage_limit_email: { ww_ride: true, excess_mileage: 40, excess_mileage_cost: 4000 } }, { bbc_total_cost: 13150.0, bbc_salary_charge: 4000 } ],
          [ true,  true,  false,                 false,                                                                                               { bbc_total_cost: 17150.0 } ]
        ]

        expectations.each_with_index do |(outside_limit, exemption_salary_charge_enabled, alert_type, _metadata, vehicle_cost_calculation), line|
          it "checks expectations from line #{line + 1}" do
            stub_outside_limit(outside_limit)
            stub_exemption_ww_salary_charge(exemption_salary_charge_enabled)

            if alert_type.present?
              expect(service).to receive("add_#{alert_type}").and_call_original
            end

            service.execute

            # TODO: temporary disable notifications by request from BBC
            # should be enabled after testing finish
            # if metadata.present?
            #   expect(metadata_result).to eq(metadata)
            # end

            expect(vehicle_data_result).to include(vehicle_cost_calculation)
          end
        end
      end
    end

    describe 'full pd rules' do
      let(:passenger) { create(:passenger, :bbc_full_pd, :pd_accepted, company: company) }

      context 'pd expired' do
        let(:passenger) { create(:passenger, :bbc_full_pd, pd_expires_at: 1.year.ago, company: company) }

        it 'adds alert' do
          service.execute

          expect(service_result[:errors]).to include(base: [I18n.t('bookings.form_processors.bbc.no_passenger_declaration_found')])
        end
      end

      context 'ww ride' do
        before do
          allow(service).to receive(:wh_ride?).and_return(false)
          allow(service).to receive(:hw_ride?).and_return(false)
          allow(service).to receive(:ww_ride?).and_return(true)
        end

        expectations = [
          # outside_limit alert_type
          #        exemp_salary_enabled          metadata                                                                                             vehicle_cost_calc
          [ false, false, false,                 false,                                                                                               { bbc_total_cost: 17150.0 } ],
          [ false, true,  false,                 false,                                                                                               { bbc_total_cost: 17150.0 } ],
          [ true,  false, :excess_mileage_alert, { ride_over_mileage_limit_email: { ww_ride: true, excess_mileage: 40, excess_mileage_cost: 4000 } }, { bbc_total_cost: 13150.0, bbc_salary_charge: 4000 } ],
          [ true,  true,  false,                 false,                                                                                               { bbc_total_cost: 17150.0 } ]
        ]

        expectations.each_with_index do |(outside_limit, exemption_salary_charge_enabled, alert_type, _metadata, vehicle_cost_calculation), line|
          it "checks expectations from line #{line + 1}" do
            stub_outside_limit(outside_limit)
            stub_exemption_ww_salary_charge(exemption_salary_charge_enabled)

            if alert_type.present?
              expect(service).to receive("add_#{alert_type}").and_call_original
            end

            service.execute

            # TODO: temporary disable notifications by request from BBC
            # should be enabled after testing finish
            # if metadata.present?
            #   expect(metadata_result).to eq(metadata)
            # end

            expect(vehicle_data_result).to include(vehicle_cost_calculation)
          end
        end
      end

      context 'wh ride' do
        before do
          allow(service).to receive(:wh_ride?).and_return(true)
          allow(service).to receive(:hw_ride?).and_return(false)
          allow(service).to receive(:ww_ride?).and_return(false)
        end

        expectations = [
          # out_lnemt            exemp_p11d_enabled
          #        out_limit            alert_type
          #               exemp_salary_enabled                metadata                                                                                              vehicle_cost_calc
          [ true,  false, false, false, :outside_lnemt_alert, { ride_outside_lnemt_email: { lnemt_start: '22:45', lnemt_end: '06:30' } },                           { bbc_salary_charge: 17150.0 } ],
          [ true,  true,  false, false, :outside_lnemt_alert, { ride_outside_lnemt_email: { lnemt_start: '22:45', lnemt_end: '06:30' } },                           { bbc_salary_charge: 17150.0 } ],
          [ false, false, false, false, false,                false,                                                                                                {}                             ],
          [ false, true,  false, false, :outside_limit_alert, { ride_over_mileage_limit_email: { ww_ride: false, excess_mileage: 40, excess_mileage_cost: 4000 } }, { bbc_p11_tax: 8547.5, bbc_total_cost: 25697.5, bbc_salary_charge: 4000 } ],

          [ true,  false, true,  false, false,                false,                                                                                                { bbc_p11_tax: 11147.5, bbc_total_cost_to_bbc: 28297.5 } ],
          [ true,  true,  true,  false, false,                false,                                                                                                { bbc_p11_tax: 11147.5, bbc_total_cost_to_bbc: 28297.5 } ],
          [ false, false, true,  false, false,                false,                                                                                                { bbc_p11_tax: 11147.5, bbc_total_cost_to_bbc: 28297.5 } ],
          [ false, true,  true,  false, false,                false,                                                                                                { bbc_p11_tax: 11147.5, bbc_total_cost_to_bbc: 28297.5 } ],

          [ true,  false, true,  true,  false,                false,                                                                                                { bbc_total_cost: 17150.0 } ],
          [ true,  true,  true,  true,  false,                false,                                                                                                { bbc_total_cost: 17150.0 } ],
          [ false, false, true,  true,  false,                false,                                                                                                { bbc_total_cost: 17150.0 } ],
          [ false, true,  true,  true,  false,                false,                                                                                                { bbc_total_cost: 17150.0 } ],

          [ true,  false, false, true,  :outside_lnemt_alert, { ride_outside_lnemt_email: { lnemt_start: '22:45', lnemt_end: '06:30' } },                           { bbc_salary_charge: 17150.0 } ],
          [ true,  true,  false, true,  :outside_lnemt_alert, { ride_outside_lnemt_email: { lnemt_start: '22:45', lnemt_end: '06:30' } },                           { bbc_salary_charge: 17150.0 } ],
          [ false, false, false, true,  false,                false,                                                                                                { bbc_total_cost: 17150.0 } ],
          [ false, true,  false, true,  :outside_limit_alert, { ride_over_mileage_limit_email: { ww_ride: false, excess_mileage: 40, excess_mileage_cost: 4000 } }, { bbc_total_cost: 13150.0, bbc_salary_charge: 4000 } ]
        ]
        expectations.each_with_index do |(outside_lnemt, outside_limit, exemption_salary_charge_enabled, exemption_p11d_enabled, alert_type, _metadata, vehicle_cost_calculation), line|
          it "checks expectations from line #{line + 1}" do
            stub_outside_lnemt(outside_lnemt)
            stub_outside_limit(outside_limit)
            stub_exemption_whhw_salary_charge(exemption_salary_charge_enabled)
            stub_exemption_p11d(exemption_p11d_enabled)

            if alert_type.present?
              expect(service).to receive("add_#{alert_type}").and_call_original
            end

            service.execute

            # TODO: temporary disable notifications by request from BBC
            # should be enabled after testing finish
            # if metadata.present?
            #   expect(metadata_result).to eq(metadata)
            # end

            expect(vehicle_data_result).to include(vehicle_cost_calculation)
          end
        end
      end
    end

    describe 'journey type calculations' do
      context 'home_to_work journey type in params' do
        let!(:booking_params) do
          super().merge(journey_type: 'home_to_work')
        end

        before do
          # declaration distance limit eq to 10 miles
          allow(service).to receive(:distance_between).and_return(9)

          service.execute
        end

        context 'freelancer passenger' do
          let(:passenger) { create(:passenger, :bbc_freelancer, company: company) }

          it 'changes journey_type to work_to_work' do
            expect(service_result[:booking_params]).to include(journey_type: 'work_to_work')
          end
        end

        context 'temp pd passenger' do
          let(:passenger) { create(:passenger, :bbc_temp_pd, company: company) }

          it 'changes journey_type to work_to_work' do
            expect(service_result[:booking_params]).to include(journey_type: 'work_to_work')
          end
        end

        context 'thin pd passenger' do
          let(:passenger) { create(:passenger, :bbc_thin_pd, :pd_accepted, company: company) }

          it 'changes journey_type to work_to_work' do
            expect(service_result[:booking_params]).to include(journey_type: 'work_to_work')
          end
        end

        context 'full pd passenger' do
          let(:passenger) { create(:passenger, :bbc_full_pd, :pd_accepted, company: company) }

          it 'returns original journey_type' do
            expect(service_result[:booking_params]).to include(journey_type: 'home_to_work')
          end
        end
      end
    end
  end

  # NOTE: this is private method, but it is stubbed in #execute tests (via #outside_lnemt? stub),
  # so we need to test it manually
  describe '#time_range_cover?' do
    let(:form_processor) do
      described_class.new(company: company)
    end

    context 'when range_from < range_to' do
      let(:range_from) { '05:05' }
      let(:range_to) { '10:40' }

      context 'when time in range' do
        let(:time) { '06:05' }

        it { expect(form_processor.send(:time_range_cover?, range_from, range_to, time)).to be_truthy }
      end

      context 'when time outside of range' do
        let(:time) { '16:05' }

        it { expect(form_processor.send(:time_range_cover?, range_from, range_to, time)).to be_falsey }
      end
    end

    context 'when range_from > range_to' do
      let(:range_from) { '22:05' }
      let(:range_to) { '06:55' }

      context 'when time in range' do
        let(:time1) { '23:05' }
        let(:time2) { '05:55' }

        it { expect(form_processor.send(:time_range_cover?, range_from, range_to, time1)).to be_truthy }
        it { expect(form_processor.send(:time_range_cover?, range_from, range_to, time2)).to be_truthy }
      end

      context 'when time outside of range' do
        let(:time1) { '21:05' }
        let(:time2) { '07:05' }

        it { expect(form_processor.send(:time_range_cover?, range_from, range_to, time1)).to be_falsey }
        it { expect(form_processor.send(:time_range_cover?, range_from, range_to, time2)).to be_falsey }
      end
    end
  end
end
