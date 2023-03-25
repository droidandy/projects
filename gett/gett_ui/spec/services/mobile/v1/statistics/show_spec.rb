require 'rails_helper'

RSpec.describe Mobile::V1::Statistics::Show, type: :service do
  let(:company)       { create(:company) }
  let(:admin)         { create(:admin, company: company) }
  let(:companyadmin)  { create(:companyadmin, company: company) }
  let(:travelmanager) { create(:travelmanager, company: company) }
  let(:finance)       { create(:finance, company: company) }
  let(:passenger)     { create(:passenger, company: company) }
  let(:booker)        { create(:booker, company: company) }

  service_context { { company: company, member: passenger } }

  describe '#execute' do
    subject(:service) { described_class.new }

    before { service.execute }

    it { is_expected.to be_success }

    context 'member passenger' do
      its(:result) do
        is_expected.not_to include(
          :completed_orders_by_company,
          :top_passengers,
          :top_bookers
        )
        is_expected.to include(
          :daily_completed_cancelled_orders,
          :daily_cost,
          :daily_completed_orders_by_vehicle_name,
          :daily_avg_cost_by_vehicle_name,
          :completed_orders_by_city
        )
      end

      describe 'execution result' do
        let(:pickup_address_1) { create(:address, city: 'city_1') }
        let(:pickup_address_2) { create(:address, city: 'city_2') }
        let(:pickup_address_3) { create(:address, city: 'city_3') }

        let(:black_taxi) { create(:vehicle, :gett, name: 'BlackTaxi') }
        let(:standard)   { create(:vehicle, :one_transport, name: 'Standard') }
        let(:carey)      { create(:vehicle, :carey, name: 'Chauffeur') }
        let(:special)    { create(:vehicle, :manual, name: 'Special') }

        let(:other_company)           { create(:company) }
        let(:other_company_passenger) { create(:passenger, company: other_company) }
        let(:other_passenger)         { create(:passenger, company: company) }

        before do
          create_list(:booking, 2, :completed, passenger: passenger, company: company, total_cost: 1000, pickup_address: pickup_address_1, vehicle: black_taxi, scheduled_at: Date.current)
          create_list(:booking, 3, :cancelled, passenger: passenger, company: company, total_cost: 2000, pickup_address: pickup_address_2, vehicle: standard, scheduled_at: Date.current)
          create_list(:booking, 4, :completed, passenger: passenger, company: company, total_cost: 3000, pickup_address: pickup_address_3, vehicle: carey, scheduled_at: 1.day.ago)
          create_list(:booking, 3, :cancelled, passenger: passenger, company: company, total_cost: 4000, pickup_address: pickup_address_1, vehicle: special, scheduled_at: 2.days.ago)
          create_list(:booking, 1, :completed, passenger: passenger, company: company, total_cost: 5000, pickup_address: pickup_address_2, vehicle: black_taxi, scheduled_at: 3.days.ago)
          create_list(:booking, 2, :cancelled, passenger: passenger, company: company, total_cost: 6000, pickup_address: pickup_address_3, vehicle: standard, scheduled_at: 3.days.ago)
          create_list(:booking, 2, :cancelled, passenger: passenger, company: company, total_cost: 7000, pickup_address: pickup_address_1, vehicle: carey, scheduled_at: 4.days.ago)
          create_list(:booking, 1, :completed, passenger: passenger, company: company, total_cost: 8000, pickup_address: pickup_address_2, vehicle: special, scheduled_at: 5.days.ago)
          create_list(:booking, 4, :completed, passenger: passenger, company: company, total_cost: 9000, pickup_address: pickup_address_3, vehicle: black_taxi, scheduled_at: 6.days.ago)
          create_list(:booking, 3, :cancelled, passenger: passenger, company: company, total_cost: 10000, pickup_address: pickup_address_1, vehicle: standard, scheduled_at: 6.days.ago)

          create(:booking, :completed, passenger: passenger, company: company, total_cost: 11000, pickup_address: pickup_address_1, vehicle: black_taxi, scheduled_at: 1.day.from_now)
          create(:booking, :completed, passenger: passenger, company: company, total_cost: 12000, pickup_address: pickup_address_2, vehicle: standard, scheduled_at: 7.days.ago)
          create(:booking, :on_the_way, passenger: passenger, company: company, pickup_address: pickup_address_3, vehicle: carey, scheduled_at: 2.days.ago)
          create(:booking, :rejected, passenger: passenger, company: company, pickup_address: pickup_address_1, vehicle: special, scheduled_at: 2.days.ago)
          create(:booking, :completed, passenger: other_passenger, company: company, total_cost: 15000, pickup_address: pickup_address_2, vehicle: black_taxi, scheduled_at: 2.days.ago)
          create(:booking, :cancelled, passenger: other_passenger, company: company, total_cost: 16000, pickup_address: pickup_address_3, vehicle: standard, scheduled_at: 2.days.ago)
          create(:booking, :completed, passenger: other_company_passenger, company: other_company, total_cost: 17000, pickup_address: pickup_address_1, vehicle: carey, scheduled_at: 2.days.ago)
          create(:booking, :cancelled, passenger: other_company_passenger, company: other_company, total_cost: 18000, pickup_address: pickup_address_2, vehicle: special, scheduled_at: 2.days.ago)
        end

        subject do
          described_class.new.execute.result
        end

        describe 'daily completed/cancelled orders' do
          its([:daily_completed_cancelled_orders]) do
            is_expected.to eq([
              { date: 6.days.ago.to_date, completed: 4, cancelled: 3, name: 6.days.ago.to_date.strftime },
              { date: 5.days.ago.to_date, completed: 1, cancelled: 0, name: 5.days.ago.to_date.strftime },
              { date: 4.days.ago.to_date, completed: 0, cancelled: 2, name: 4.days.ago.to_date.strftime },
              { date: 3.days.ago.to_date, completed: 1, cancelled: 2, name: 3.days.ago.to_date.strftime },
              { date: 2.days.ago.to_date, completed: 0, cancelled: 3, name: 2.days.ago.to_date.strftime },
              { date: 1.day.ago.to_date, completed: 4, cancelled: 0, name: 1.day.ago.to_date.strftime },
              { date: Date.current, completed: 2, cancelled: 3, name: Date.current.strftime }
            ])
          end
        end

        describe 'daily cost' do
          its([:daily_cost]) do
            is_expected.to eq([
              { date: 6.days.ago.to_date, spend: 660, name: 6.days.ago.to_date.strftime },
              { date: 5.days.ago.to_date, spend: 80, name: 5.days.ago.to_date.strftime },
              { date: 4.days.ago.to_date, spend: 140, name: 4.days.ago.to_date.strftime },
              { date: 3.days.ago.to_date, spend: 170, name: 3.days.ago.to_date.strftime },
              { date: 2.days.ago.to_date, spend: 120, name: 2.days.ago.to_date.strftime },
              { date: 1.day.ago.to_date, spend: 120, name: 1.day.ago.to_date.strftime },
              { date: Date.current, spend: 80, name: Date.current.strftime }
            ])
          end
        end

        describe 'daily completed orders by vehicle name' do
          its([:daily_completed_orders_by_vehicle_name]) do
            is_expected.to eq([
              { date: 6.days.ago.to_date, Standard: 0, BlackTaxi: 4, BlackTaxiXL: 0, Exec: 0, MPV: 0, Special: 0, GettXL: 0, GettExpress: 0, Economy: 0, StandardXL: 0, Business: 0, BabySeat: 0, Wheelchair: 0, Chauffeur: 0, name: 6.days.ago.to_date.strftime },
              { date: 5.days.ago.to_date, Standard: 0, BlackTaxi: 0, BlackTaxiXL: 0, Exec: 0, MPV: 0, Special: 1, GettXL: 0, GettExpress: 0, Economy: 0, StandardXL: 0, Business: 0, BabySeat: 0, Wheelchair: 0, Chauffeur: 0, name: 5.days.ago.to_date.strftime },
              { name: 4.days.ago.to_date.strftime },
              { date: 3.days.ago.to_date, Standard: 0, BlackTaxi: 1, BlackTaxiXL: 0, Exec: 0, MPV: 0, Special: 0, GettXL: 0, GettExpress: 0, Economy: 0, StandardXL: 0, Business: 0, BabySeat: 0, Wheelchair: 0, Chauffeur: 0, name: 3.days.ago.to_date.strftime },
              { name: 2.days.ago.to_date.strftime },
              { date: 1.day.ago.to_date, Standard: 0, BlackTaxi: 0, BlackTaxiXL: 0, Exec: 0, MPV: 0, Special: 0, GettXL: 0, GettExpress: 0, Economy: 0, StandardXL: 0, Business: 0, BabySeat: 0, Wheelchair: 0, Chauffeur: 4, name: 1.day.ago.to_date.strftime },
              { date: Date.current, Standard: 0, BlackTaxi: 2, BlackTaxiXL: 0, Exec: 0, MPV: 0, Special: 0, GettXL: 0, GettExpress: 0, Economy: 0, StandardXL: 0, Business: 0, BabySeat: 0, Wheelchair: 0, Chauffeur: 0, name: Date.current.strftime }
            ])
          end
        end

        describe 'daily average cost by vehicle name' do
          its([:daily_avg_cost_by_vehicle_name]) do
            is_expected.to eq([
              { date: 6.days.ago.to_date, Standard: 100, BlackTaxi: 90, BlackTaxiXL: 0, Exec: 0, MPV: 0, Special: 0, GettXL: 0, GettExpress: 0, Economy: 0, StandardXL: 0, Business: 0, BabySeat: 0, Wheelchair: 0, Chauffeur: 0, name: 6.days.ago.to_date.strftime },
              { date: 5.days.ago.to_date, Standard: 0, BlackTaxi: 0, BlackTaxiXL: 0, Exec: 0, MPV: 0, Special: 80, GettXL: 0, GettExpress: 0, Economy: 0, StandardXL: 0, Business: 0, BabySeat: 0, Wheelchair: 0, Chauffeur: 0, name: 5.days.ago.to_date.strftime },
              { date: 4.days.ago.to_date, Standard: 0, BlackTaxi: 0, BlackTaxiXL: 0, Exec: 0, MPV: 0, Special: 0, GettXL: 0, GettExpress: 0, Economy: 0, StandardXL: 0, Business: 0, BabySeat: 0, Wheelchair: 0, Chauffeur: 70, name: 4.days.ago.to_date.strftime },
              { date: 3.days.ago.to_date, Standard: 60, BlackTaxi: 50, BlackTaxiXL: 0, Exec: 0, MPV: 0, Special: 0, GettXL: 0, GettExpress: 0, Economy: 0, StandardXL: 0, Business: 0, BabySeat: 0, Wheelchair: 0, Chauffeur: 0, name: 3.days.ago.to_date.strftime },
              { date: 2.days.ago.to_date, Standard: 0, BlackTaxi: 0, BlackTaxiXL: 0, Exec: 0, MPV: 0, Special: 40, GettXL: 0, GettExpress: 0, Economy: 0, StandardXL: 0, Business: 0, BabySeat: 0, Wheelchair: 0, Chauffeur: 0, name: 2.days.ago.to_date.strftime },
              { date: 1.day.ago.to_date, Standard: 0, BlackTaxi: 0, BlackTaxiXL: 0, Exec: 0, MPV: 0, Special: 0, GettXL: 0, GettExpress: 0, Economy: 0, StandardXL: 0, Business: 0, BabySeat: 0, Wheelchair: 0, Chauffeur: 30, name: 1.day.ago.to_date.strftime },
              { date: Date.current, Standard: 20, BlackTaxi: 10, BlackTaxiXL: 0, Exec: 0, MPV: 0, Special: 0, GettXL: 0, GettExpress: 0, Economy: 0, StandardXL: 0, Business: 0, BabySeat: 0, Wheelchair: 0, Chauffeur: 0, name: Date.current.strftime }
            ])
          end
        end

        describe 'completed orders by city' do
          its([:completed_orders_by_city]) do
            is_expected.to eq([
              { name: 'city_1', value: 2 },
              { name: 'city_2', value: 2 },
              { name: 'city_3', value: 8 }
            ])
          end
        end
      end
    end

    context 'member booker' do
      service_context { { company: company, member: booker } }

      its(:result) do
        is_expected.not_to include(
          :completed_orders_by_company,
          :top_passengers,
          :top_bookers
        )
        is_expected.to include(
          :daily_completed_cancelled_orders,
          :daily_cost,
          :daily_completed_orders_by_vehicle_name,
          :daily_avg_cost_by_vehicle_name,
          :completed_orders_by_city
        )
      end
    end

    context 'member admin' do
      service_context { { company: company, member: admin } }

      context 'company has no linked companies' do
        its(:result) do
          is_expected.not_to include(
            :completed_orders_by_company
          )
          is_expected.to include(
            :daily_completed_cancelled_orders,
            :daily_cost,
            :daily_completed_orders_by_vehicle_name,
            :daily_avg_cost_by_vehicle_name,
            :completed_orders_by_city,
            :top_passengers,
            :top_bookers
          )
        end

        describe 'result#top_bookers' do
          let(:other_company)      { create(:company) }
          let(:booker_1)           { create(:booker, company: company) }
          let(:booker_2)           { create(:booker, company: company) }
          let(:booker_3)           { create(:booker, company: company) }
          let(:booker_4)           { create(:booker, company: company) }
          let(:booker_5)           { create(:booker, company: company) }
          let(:booker_6)           { create(:booker, company: company) }
          let(:booker_7)           { create(:booker, company: company) }
          let(:booker_8)           { create(:booker, company: company) }
          let(:booker_9)           { create(:booker, company: company) }
          let(:booker_10)          { create(:booker, company: company) }
          let(:booker_11)          { create(:booker, company: company) }
          let(:booker_12)          { create(:booker, company: company) }
          let(:booker_13)          { create(:booker, company: other_company) }
          let(:back_office_booker) { create(:user, :superadmin) }

          before do
            create_list(:booking, 2, booker: booker_1, scheduled_at: 2.days.ago.to_date)
            create_list(:booking, 2, booker: booker_1, scheduled_at: 10.days.ago.to_date)
            create_list(:booking, 3, booker: booker_2, scheduled_at: 1.day.ago.to_date)
            create_list(:booking, 4, booker: booker_3, scheduled_at: 5.days.ago.to_date)
            create_list(:booking, 5, booker: booker_4, scheduled_at: 4.days.ago.to_date)
            create_list(:booking, 6, booker: booker_5, scheduled_at: 3.days.ago.to_date)
            create_list(:booking, 7, booker: booker_6, scheduled_at: 1.day.ago.to_date)
            create_list(:booking, 8, booker: booker_7, scheduled_at: 6.days.ago.to_date)
            create_list(:booking, 9, booker: booker_8, scheduled_at: 2.days.ago.to_date)
            create_list(:booking, 10, booker: booker_9, scheduled_at: 1.day.ago.to_date)
            create_list(:booking, 11, booker: booker_10, scheduled_at: 3.days.ago.to_date)
            create_list(:booking, 12, booker: booker_11, scheduled_at: 4.days.ago.to_date)
            create_list(:booking, 13, booker: booker_12, scheduled_at: 5.days.ago.to_date)
            create_list(:booking, 13, booker: booker_13, scheduled_at: 2.days.ago.to_date)
            create_list(:booking, 15, booker: back_office_booker, company_info_id: company.company_info.id, scheduled_at: 2.days.ago.to_date)
          end

          subject do
            described_class.new.execute.result[:top_bookers]
          end

          let(:top_bookers_ids) do
            [
              booker_12.id,
              booker_11.id,
              booker_10.id,
              booker_9.id,
              booker_8.id,
              booker_7.id,
              booker_6.id,
              booker_5.id,
              booker_4.id,
              booker_3.id
            ]
          end

          it { expect(subject.map{ |h| h[:id] }).to eq top_bookers_ids }
          it { expect(subject.first).to include(:id, :first_name, :last_name, :count) }
        end

        describe 'result#top_passengers' do
          let(:other_company) { create(:company) }
          let(:passenger_1)   { create(:passenger, company: company) }
          let(:passenger_2)   { create(:passenger, company: company) }
          let(:passenger_3)   { create(:passenger, company: company) }
          let(:passenger_4)   { create(:passenger, company: company) }
          let(:passenger_5)   { create(:passenger, company: company) }
          let(:passenger_6)   { create(:passenger, company: company) }
          let(:passenger_7)   { create(:passenger, company: company) }
          let(:passenger_8)   { create(:passenger, company: company) }
          let(:passenger_9)   { create(:passenger, company: company) }
          let(:passenger_10)  { create(:passenger, company: company) }
          let(:passenger_11)  { create(:passenger, company: company) }
          let(:passenger_12)  { create(:passenger, company: company) }
          let(:passenger_13)  { create(:passenger, company: other_company) }

          before do
            create_list(:booking, 2, company: company, passenger: passenger_1, scheduled_at: 2.days.ago.to_date)
            create_list(:booking, 2, company: company, passenger: passenger_1, scheduled_at: 10.days.ago.to_date)
            create_list(:booking, 3, company: company, passenger: passenger_2, scheduled_at: 1.day.ago.to_date)
            create_list(:booking, 4, company: company, passenger: passenger_3, scheduled_at: 5.days.ago.to_date)
            create_list(:booking, 5, company: company, passenger: passenger_4, scheduled_at: 4.days.ago.to_date)
            create_list(:booking, 6, company: company, passenger: passenger_5, scheduled_at: 3.days.ago.to_date)
            create_list(:booking, 7, company: company, passenger: passenger_6, scheduled_at: 1.day.ago.to_date)
            create_list(:booking, 8, company: company, passenger: passenger_7, scheduled_at: 6.days.ago.to_date)
            create_list(:booking, 9, company: company, passenger: passenger_8, scheduled_at: 2.days.ago.to_date)
            create_list(:booking, 10, company: company, passenger: passenger_9, scheduled_at: 1.day.ago.to_date)
            create_list(:booking, 11, company: company, passenger: passenger_10, scheduled_at: 3.days.ago.to_date)
            create_list(:booking, 12, company: company, passenger: passenger_11, scheduled_at: 4.days.ago.to_date)
            create_list(:booking, 13, company: company, passenger: passenger_12, scheduled_at: 5.days.ago.to_date)
            create_list(:booking, 13, company: other_company, passenger: passenger_13, scheduled_at: 2.days.ago.to_date)
          end

          subject do
            described_class.new.execute.result[:top_passengers]
          end

          let(:top_passengers_ids) do
            [
              passenger_12.id,
              passenger_11.id,
              passenger_10.id,
              passenger_9.id,
              passenger_8.id,
              passenger_7.id,
              passenger_6.id,
              passenger_5.id,
              passenger_4.id,
              passenger_3.id
            ]
          end

          it { expect(subject.map{ |h| h[:id] }).to eq top_passengers_ids }
          it { expect(subject.first).to include(:id, :first_name, :last_name, :count) }
        end
      end

      context 'company has linked companies' do
        let(:company)  { create(:company, linked_company_pks: [linked_company.id]) }
        let(:linked_company) { create(:company) }

        its(:result) do
          is_expected.to include(
            :completed_orders_by_company,
            :daily_completed_cancelled_orders,
            :daily_cost,
            :daily_completed_orders_by_vehicle_name,
            :daily_avg_cost_by_vehicle_name,
            :completed_orders_by_city,
            :top_passengers,
            :top_bookers
          )
        end

        describe 'completed orders by company' do
          let(:linked_company_passenger) { create(:passenger, company: linked_company) }
          let(:other_company)            { create(:company) }
          let(:other_company_passenger)  { create(:passenger, company: other_company) }

          before do
            create_list(:booking, 1, :completed, passenger: passenger, company: company, scheduled_at: Date.current)
            create_list(:booking, 2, :cancelled, passenger: passenger, company: company, scheduled_at: Date.current)
            create_list(:booking, 3, :completed, passenger: linked_company_passenger, company: linked_company, scheduled_at: Date.current)
            create_list(:booking, 4, :completed, passenger: other_company_passenger, company: other_company, scheduled_at: Date.current)
            create_list(:booking, 4, :completed, passenger: passenger, company: company, scheduled_at: 1.day.ago.to_date)
            create_list(:booking, 3, :completed, passenger: passenger, company: company, scheduled_at: 2.days.ago.to_date)
            create_list(:booking, 3, :completed, passenger: linked_company_passenger, company: linked_company, scheduled_at: 2.days.ago.to_date)
            create_list(:booking, 1, :completed, passenger: passenger, company: company, scheduled_at: 3.days.ago.to_date)
            create_list(:booking, 2, :cancelled, passenger: passenger, company: company, scheduled_at: 3.days.ago.to_date)
            create_list(:booking, 2, :cancelled, passenger: passenger, company: company, scheduled_at: 4.days.ago.to_date)
            create_list(:booking, 1, :completed, passenger: passenger, company: company, scheduled_at: 5.days.ago.to_date)
            create_list(:booking, 4, :completed, passenger: passenger, company: company, scheduled_at: 6.days.ago.to_date)
            create_list(:booking, 3, :cancelled, passenger: passenger, company: company, scheduled_at: 6.days.ago.to_date)

            create(:booking, :completed, passenger: passenger, company: company, scheduled_at: 1.day.from_now.to_date)
            create(:booking, :completed, passenger: passenger, company: company, scheduled_at: 7.days.ago.to_date)
            create(:booking, :on_the_way, passenger: passenger, company: company, scheduled_at: 2.days.ago.to_date)
            create(:booking, :rejected, passenger: passenger, company: company, scheduled_at: 2.days.ago.to_date)
            create(:booking, :completed, passenger: other_company_passenger, company: other_company, scheduled_at: 2.days.ago.to_date)
            create(:booking, :cancelled, passenger: other_company_passenger, company: other_company, scheduled_at: 2.days.ago.to_date)
          end

          subject do
            described_class.new.execute.result[:completed_orders_by_company]
          end

          it { is_expected.to match_array([{ name: company.name, value: 14 }, { name: linked_company.name, value: 6 }]) }
        end
      end
    end

    context 'member companyadmin' do
      service_context { { company: company, member: companyadmin } }

      its(:result) do
        is_expected.not_to include(
          :completed_orders_by_company
        )
        is_expected.to include(
          :daily_completed_cancelled_orders,
          :daily_cost,
          :daily_completed_orders_by_vehicle_name,
          :daily_avg_cost_by_vehicle_name,
          :completed_orders_by_city,
          :top_passengers,
          :top_bookers
        )
      end
    end

    context 'member travelmanager' do
      service_context { { company: company, member: travelmanager } }

      its(:result) do
        is_expected.not_to include(
          :completed_orders_by_company
        )
        is_expected.to include(
          :daily_completed_cancelled_orders,
          :daily_cost,
          :daily_completed_orders_by_vehicle_name,
          :daily_avg_cost_by_vehicle_name,
          :completed_orders_by_city,
          :top_passengers,
          :top_bookers
        )
      end
    end

    context 'member finance' do
      service_context { { company: company, member: finance } }

      its(:result) do
        is_expected.not_to include(
          :completed_orders_by_company
        )
        is_expected.to include(
          :daily_completed_cancelled_orders,
          :daily_cost,
          :daily_completed_orders_by_vehicle_name,
          :daily_avg_cost_by_vehicle_name,
          :completed_orders_by_city,
          :top_passengers,
          :top_bookers
        )
      end
    end
  end
end
