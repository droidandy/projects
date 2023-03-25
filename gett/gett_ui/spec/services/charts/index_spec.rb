require 'rails_helper'

RSpec.describe Charts::Index, type: :service do
  let(:company)    { create(:company) }
  let(:booker_1)   { create(:booker, company: company) }
  let(:vehicle_gt) { create(:vehicle, :gett, name: 'BlackTaxi') }
  let(:vehicle_ot) { create(:vehicle, :one_transport, name: 'Standard') }

  before { Timecop.freeze('2018-03-26 08:00'.to_datetime) }
  after  { Timecop.return }

  let(:pickup_address_1) { create(:address, city: 'city_1') }
  let(:pickup_address_2) { create(:address, city: 'city_2') }
  let!(:booking_1)       { create(:booking, :completed, :asap, booker: booker_1, total_cost: 10000, paid_waiting_time_fee: 500, vehicle: vehicle_ot, pickup_address: pickup_address_1) }
  let!(:booking_2)       { create(:booking, :cancelled, :asap, booker: booker_1, total_cost: 10000, vehicle: vehicle_ot) }
  let!(:booking_3)       { create(:booking, :completed, :scheduled, booker: booker_1, total_cost: 10000, scheduled_at: 2.hours.from_now, vehicle: vehicle_ot, pickup_address: pickup_address_2) }
  let!(:booking_4)       { create(:booking, :cancelled, :scheduled, booker: booker_1, total_cost: 10000, scheduled_at: 2.hours.from_now, vehicle: vehicle_ot) }

  let(:bookings_day)   { Time.current - 1.day }
  let(:bookings_month) { bookings_day.strftime('%b, %Y') }
  let(:bookings_date)  { bookings_day.strftime('%e') }

  service_context { { company: company } }

  it { is_expected.to be_authorized_by(Charts::IndexPolicy) }

  describe '#execute' do
    context 'for dashboard' do
      subject(:service) { described_class.new(for_dashboard: true) }

      before { service.execute }
      it { is_expected.to be_success }
      its(:result) do
        is_expected.to include(:count_by_status_monthly, :count_by_status_daily)
        is_expected.not_to include(
          :count_by_vehicle_name_monthly,
          :count_by_vehicle_name_daily,
          :spend_by_booking_type_monthly,
          :spend_by_booking_type_daily,
          :spend_by_month,
          :completed_by_vehicle_name,
          :completed_by_schedule_type,
          :month_rides_all_cities,
          :month_rides_by_city,
          :month_spend_all_cities,
          :month_spend_by_city,
          :month_waiting_cost_all_cities,
          :month_waiting_cost_by_city,
          :month_avg_cost_per_vehicle_all_cities,
          :month_avg_cost_per_vehicle_by_city,
          :month_rides_all_companies,
          :month_rides_by_company,
          :month_spend_all_companies,
          :month_spend_by_company,
          :month_waiting_cost_all_companies,
          :month_waiting_cost_by_company,
          :month_avg_cost_per_vehicle_all_companies,
          :month_avg_cost_per_vehicle_by_company
        )
      end
    end
    context 'without parameters' do
      subject(:service) { described_class.new }

      before { service.execute }
      it { is_expected.to be_success }
      its(:result) do
        is_expected.to include(
          :count_by_status_monthly,
          :count_by_status_daily,
          :count_by_vehicle_name_monthly,
          :count_by_vehicle_name_daily,
          :spend_by_booking_type_monthly,
          :spend_by_booking_type_daily,
          :spend_by_month,
          :completed_by_vehicle_name,
          :completed_by_schedule_type,
          :month_rides_all_cities,
          :month_rides_by_city,
          :month_spend_all_cities,
          :month_spend_by_city,
          :month_waiting_cost_all_cities,
          :month_waiting_cost_by_city,
          :month_avg_cost_per_vehicle_all_cities,
          :month_avg_cost_per_vehicle_by_city
        )
        is_expected.not_to include(
          :month_rides_all_companies,
          :month_rides_by_company,
          :month_spend_all_companies,
          :month_spend_by_company,
          :month_waiting_cost_all_companies,
          :month_waiting_cost_by_company,
          :month_avg_cost_per_vehicle_all_companies,
          :month_avg_cost_per_vehicle_by_company
        )
      end

      describe 'result' do
        subject(:result) { service.result }

        it "includes today's orders in calculations" do
          Timecop.travel(1.hour.from_now) do
            stats = result[:count_by_status_monthly].find{ |st| st[:name] == 'Mar, 2018' }
            expect(stats).to include(completed: 2, cancelled: 2)
          end
        end
      end
    end

    context 'with linked_companies' do
      let(:company)  { create(:company, linked_company_pks: [linked_company.id]) }
      let(:booker_2) { create(:booker, company: linked_company) }
      let(:linked_company) { create(:company) }

      # bookings for second company:
      let(:pickup_address_3) { create(:address, city: 'city_3') }
      let(:pickup_address_4) { create(:address, city: 'city_4') }
      let!(:booking_5)       { create(:booking, :completed, :asap, booker: booker_2, total_cost: 10000, paid_waiting_time_fee: 700, vehicle: vehicle_gt, pickup_address: pickup_address_3) }
      let!(:booking_6)       { create(:booking, :cancelled, :asap, booker: booker_2, total_cost: 10000, vehicle: vehicle_gt) }
      let!(:booking_7)       { create(:booking, :completed, :scheduled, booker: booker_2, total_cost: 10000, scheduled_at: 2.hours.from_now, vehicle: vehicle_gt, pickup_address: pickup_address_4) }
      let!(:booking_8)       { create(:booking, :cancelled, :scheduled, booker: booker_2, total_cost: 10000, scheduled_at: 2.hours.from_now, vehicle: vehicle_gt) }
      let!(:booking_9)       { create(:booking, :completed, :asap, booker: booker_1, scheduled_at: 1.month.ago, vehicle: vehicle_ot) }

      subject(:service) { described_class.new(with_linked_companies: true) }

      before do
        Timecop.travel 1.day.from_now
        service.execute
      end

      it { is_expected.to be_success }

      it 'correctly calculates count_by_status_monthly' do
        data = service.result[:count_by_status_monthly].find{ |i| i[:name] == bookings_month }

        expect(data).to eq(
          date: bookings_day.beginning_of_month.to_datetime,
          name: bookings_month,
          completed: 4,
          cancelled: 4
        )
      end

      it 'correctly calculates count_by_status_daily' do
        data = service.result[:count_by_status_daily].last.find{ |i| i[:name] == bookings_date }
        expect(data).to eq(date: bookings_day.to_date, name: bookings_date, completed: 4, cancelled: 4)
      end

      it 'correctly calculates count_by_vehicle_name_monthly' do
        data = service.result[:count_by_vehicle_name_monthly].find{ |i| i[:name] == bookings_month }
        expect(data).to eq(
          BlackTaxi: 2,
          BlackTaxiXL: 0,
          Chauffeur: 0,
          Exec: 0,
          MPV: 0,
          Standard: 2,
          Special: 0,
          GettXL: 0,
          GettExpress: 0,
          Economy: 0,
          StandardXL: 0,
          Business: 0,
          BabySeat: 0,
          Wheelchair: 0,
          date: bookings_day.beginning_of_month.to_datetime,
          name: bookings_month
        )
      end

      it 'count_by_vehicle_name_daily' do
        data = service.result[:count_by_vehicle_name_daily].last.find{ |i| i[:name] == bookings_date }
        expect(data).to eq(
          date: bookings_day.to_date,
          name: bookings_date,
          BlackTaxi: 2,
          BlackTaxiXL: 0,
          Chauffeur: 0,
          Exec: 0,
          MPV: 0,
          Standard: 2,
          Special: 0,
          GettXL: 0,
          GettExpress: 0,
          Economy: 0,
          StandardXL: 0,
          Business: 0,
          BabySeat: 0,
          Wheelchair: 0
        )
      end

      it 'correctly calculates spend_by_booking_type_monthly' do
        data = service.result[:spend_by_booking_type_monthly].find{ |i| i[:name] == bookings_month }
        expect(data).to eq(
          date: bookings_day.beginning_of_month.to_datetime,
          name: bookings_month,
          phone: 0,
          web: 800
        )
      end

      it 'correctly calculates spend_by_booking_type_daily' do
        data = service.result[:spend_by_booking_type_daily].last.find{ |i| i[:name] == bookings_date }
        expect(data).to eq(
          date: bookings_day.to_date,
          name: bookings_date,
          phone: 0,
          web: 800
        )
      end

      it 'correctly calculates spend_by_month' do
        data = service.result[:spend_by_month].find{ |i| i[:name] == bookings_date.to_i }
        expect(data).to eq(
          date: bookings_date.to_i,
          name: bookings_date.to_i,
          previous: 0,
          current: 400
        )
      end

      it 'correctly calculates completed_by_vehicle_name' do
        data = service.result[:completed_by_vehicle_name]
        expect(data).to match_array([
          { name: "Standard",      value: 2 },
          { name: "BlackTaxi",     value: 2 },
          { name: "BlackTaxiXL",   value: 0 },
          { name: "Exec",          value: 0 },
          { name: "MPV",           value: 0 },
          { name: "Special",       value: 0 },
          { name: "GettXL",        value: 0 },
          { name: "GettExpress",   value: 0 },
          { name: "Economy",       value: 0 },
          { name: "StandardXL",    value: 0 },
          { name: "Business",      value: 0 },
          { name: "Chauffeur",     value: 0 },
          { name: "BabySeat",      value: 0 },
          { name: "Wheelchair",    value: 0 }
        ])
      end

      it 'correctly calculates completed_by_schedule_type' do
        expect(service.result[:completed_by_schedule_type]).to eq([
          { name: 'asap', value: 2 },
          { name: 'future', value: 2 }
        ])
      end

      it 'correctly calculates month_rides_all_cities' do
        expect(service.result[:month_rides_all_cities]).to eq([
          date: bookings_day.beginning_of_month,
          all_cities: 4
        ])
      end

      it 'correctly calculates month_rides_by_city' do
        expect(service.result[:month_rides_by_city]).to eq([[{
          'city_1' => 1,
          'city_2' => 1,
          'city_3' => 1,
          'city_4' => 1
        }]])
      end

      it 'correctly calculates month_spend_all_cities' do
        expect(service.result[:month_spend_all_cities]).to eq([
          date: bookings_day.beginning_of_month,
          all_cities: 400
        ])
      end

      it 'correctly calculates month_spend_by_city' do
        expect(service.result[:month_spend_by_city]).to eq([[{
          'city_1' => 100,
          'city_2' => 100,
          'city_3' => 100,
          'city_4' => 100
        }]])
      end

      it 'correctly calculates month_waiting_cost_all_cities' do
        expect(service.result[:month_waiting_cost_all_cities]).to eq([
          date: bookings_day.beginning_of_month,
          all_cities: 12
        ])
      end

      it 'correctly calculates month_waiting_cost_by_city' do
        expect(service.result[:month_waiting_cost_by_city]).to eq([[{
          'city_1' => 5,
          'city_2' => 0,
          'city_3' => 7,
          'city_4' => 0
        }]])
      end

      it 'correctly calculates month_avg_cost_per_vehicle_all_cities' do
        expect(service.result[:month_avg_cost_per_vehicle_all_cities]).to eq([{
          date: bookings_day.beginning_of_month,
          Standard: 100,
          BlackTaxi: 100,
          BlackTaxiXL: 0,
          Exec: 0,
          MPV: 0,
          Special: 0,
          GettXL: 0,
          GettExpress: 0,
          Economy: 0,
          StandardXL: 0,
          Business: 0,
          Chauffeur: 0,
          BabySeat: 0,
          Wheelchair: 0
        }])
      end

      it 'correctly calculates month_avg_cost_per_vehicle_by_city' do
        expect(service.result[:month_avg_cost_per_vehicle_by_city].first).to match_array([
          {
            name: "city_1",
            Standard: 100,
            BlackTaxi: 0,
            BlackTaxiXL: 0,
            Exec: 0,
            MPV: 0,
            Special: 0,
            GettXL: 0,
            GettExpress: 0,
            Economy: 0,
            StandardXL: 0,
            Business: 0,
            Chauffeur: 0,
            BabySeat: 0,
            Wheelchair: 0
          },
          {
            name: "city_2",
            Standard: 100,
            BlackTaxi: 0,
            BlackTaxiXL: 0,
            Exec: 0,
            MPV: 0,
            Special: 0,
            GettXL: 0,
            GettExpress: 0,
            Economy: 0,
            StandardXL: 0,
            Business: 0,
            Chauffeur: 0,
            BabySeat: 0,
            Wheelchair: 0
          },
          {
            name: "city_3",
            Standard: 0,
            BlackTaxi: 100,
            BlackTaxiXL: 0,
            Exec: 0,
            MPV: 0,
            Special: 0,
            GettXL: 0,
            GettExpress: 0,
            Economy: 0,
            StandardXL: 0,
            Business: 0,
            Chauffeur: 0,
            BabySeat: 0,
            Wheelchair: 0
          },
          {
            name: "city_4",
            Standard: 0,
            BlackTaxi: 100,
            BlackTaxiXL: 0,
            Exec: 0,
            MPV: 0,
            Special: 0,
            GettXL: 0,
            GettExpress: 0,
            Economy: 0,
            StandardXL: 0,
            Business: 0,
            Chauffeur: 0,
            BabySeat: 0,
            Wheelchair: 0
          }
        ])
      end

      it 'correctly calculates month_rides_all_companies' do
        expect(service.result[:month_rides_all_companies]).to eq([
          date: bookings_day.beginning_of_month,
          all_companies: 4
        ])
      end

      it 'correctly calculates month_rides_by_company' do
        expect(service.result[:month_rides_by_company]).to eq([[{
          company.name => 2,
          linked_company.name => 2
        }]])
      end

      it 'correctly calculates month_spend_all_companies' do
        expect(service.result[:month_spend_all_companies]).to eq([
          date: bookings_day.beginning_of_month,
          all_companies: 400
        ])
      end

      it 'correctly calculates month_spend_by_company' do
        expect(service.result[:month_spend_by_company]).to eq([[{
          company.name => 200,
          linked_company.name => 200
        }]])
      end

      it 'correctly calculates month_waiting_cost_all_companies' do
        expect(service.result[:month_waiting_cost_all_companies]).to eq([
          date: bookings_day.beginning_of_month,
          all_companies: 12
        ])
      end

      it 'correctly calculates month_waiting_cost_by_company' do
        expect(service.result[:month_waiting_cost_by_company]).to eq([[{
          company.name => 5,
          linked_company.name => 7
        }]])
      end

      it 'correctly calculates month_avg_cost_per_vehicle_all_companies' do
        expect(service.result[:month_avg_cost_per_vehicle_all_companies]).to eq([{
          date: bookings_day.beginning_of_month,
          Standard: 100,
          BlackTaxi: 100,
          BlackTaxiXL: 0,
          Exec: 0,
          MPV: 0,
          Special: 0,
          GettXL: 0,
          GettExpress: 0,
          Economy: 0,
          StandardXL: 0,
          Business: 0,
          Chauffeur: 0,
          BabySeat: 0,
          Wheelchair: 0
        }])
      end

      it 'correctly calculates month_avg_cost_per_vehicle_by_company' do
        expect(service.result[:month_avg_cost_per_vehicle_by_company].first).to match_array([
          {
            name: company.name,
            Standard: 100,
            BlackTaxi: 0,
            BlackTaxiXL: 0,
            Exec: 0,
            MPV: 0,
            Special: 0,
            GettXL: 0,
            GettExpress: 0,
            Economy: 0,
            StandardXL: 0,
            Business: 0,
            Chauffeur: 0,
            BabySeat: 0,
            Wheelchair: 0
          },
          {
            name: linked_company.name,
            Standard: 0,
            BlackTaxi: 100,
            BlackTaxiXL: 0,
            Exec: 0,
            MPV: 0,
            Special: 0,
            GettXL: 0,
            GettExpress: 0,
            Economy: 0,
            StandardXL: 0,
            Business: 0,
            Chauffeur: 0,
            BabySeat: 0,
            Wheelchair: 0
          }
        ])
      end
    end
  end
end
