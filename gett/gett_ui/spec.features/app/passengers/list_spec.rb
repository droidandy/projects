require 'features_helper'

feature 'Passengers List' do
  let(:passengers_page)     { Pages::App.passengers }
  let(:new_passenger_page)  { Pages::App.new_passenger }
  let(:edit_passenger_page) { Pages::App.edit_passenger }
  let(:new_booking_page)    { Pages::App.new_booking }
  let(:company)             { create(:company, :enterprise) }

  feature 'Member Permissions' do
    let!(:passenger) { create(:passenger, company: company) }

    scenario "Passenger can't import/export and view another passengers" do
      create(:passenger, company: company)

      login_to_app_as(passenger.email)
      passengers_page.load

      expect(passengers_page).to have_no_export_button
      expect(passengers_page).to have_no_import_button
      expect(passengers_page).to have_passengers(count: 1)

      expect(passengers_page).to have_total_passengers(text: 1)
      expect(passengers_page).to have_active_passengers(text: 1)
    end

    feature 'as member with role Booker I can' do
      let(:booker) { create(:booker, company: company) }

      scenario 'only export passengers' do
        login_to_app_as(booker.email)
        passengers_page.load

        expect(passengers_page).to have_export_button
        expect(passengers_page).to have_no_import_button
      end

      scenario 'see passengers assigned to me' do
        assigned_passenger = create(:passenger, booker_pks: [booker.id], company: company)
        another_booker = create(:booker, active: false, company: company)
        another_passenger = create(:passenger, booker_pks: [another_booker.id], company: company)

        login_to_app_as(booker.email)
        passengers_page.load

        expect(passengers_page).to have_no_passengers(text: passenger.email)
        expect(passengers_page).to have_passengers(text: assigned_passenger.email)
        expect(passengers_page).to have_no_passengers(text: another_booker.email)
        expect(passengers_page).to have_no_passengers(text: another_passenger.email)

        expect(passengers_page).to have_total_passengers(text: 2)
        expect(passengers_page).to have_active_passengers(text: 2)
      end
    end

    feature 'as member with role Admin I can' do
      let(:admin) { create(:admin, company: company) }

      scenario 'export' do
        login_to_app_as(admin.email)
        passengers_page.load

        expect(passengers_page).to have_export_button
      end

      scenario 'see all passengers' do
        assigned_passenger = create(:passenger, booker_pks: [admin.id], company: company)
        another_admin = create(:admin, active: false, company: company)
        another_passenger = create(:passenger, booker_pks: [another_admin.id], company: company)

        login_to_app_as(admin.email)
        passengers_page.load

        expect(passengers_page).to have_passengers(text: passenger.email)
        expect(passengers_page).to have_passengers(text: assigned_passenger.email)
        expect(passengers_page).to have_passengers(text: another_admin.email)
        expect(passengers_page).to have_passengers(text: another_passenger.email)

        expect(passengers_page).to have_total_passengers(text: 6)
        expect(passengers_page).to have_active_passengers(text: 5)
      end
    end

    feature 'as member with role Finance I can' do
      let(:finance) { create(:finance, company: company) }

      scenario 'only export passengers' do
        login_to_app_as(finance.email)
        passengers_page.load

        expect(passengers_page).to have_export_button
        expect(passengers_page).to have_no_import_button
      end

      scenario 'see passengers assigned to me or without assignment' do
        assigned_passenger = create(:passenger, booker_pks: [finance.id], company: company)
        another_finance = create(:finance, active: false, company: company)
        another_passenger = create(:passenger, booker_pks: [another_finance.id], company: company)

        login_to_app_as(finance.email)
        passengers_page.load

        expect(passengers_page).to have_passengers(text: passenger.email)
        expect(passengers_page).to have_passengers(text: assigned_passenger.email)
        expect(passengers_page).to have_passengers(text: another_finance.email)
        expect(passengers_page).to have_passengers(text: another_passenger.email)

        expect(passengers_page).to have_total_passengers(text: 6)
        expect(passengers_page).to have_active_passengers(text: 5)
      end
    end

    feature 'as member with role Travel Manager I can' do
      let(:tm) { create(:travelmanager, company: company) }

      scenario 'export' do
        login_to_app_as(tm.email)
        passengers_page.load

        expect(passengers_page).to have_export_button
      end

      scenario 'see all passengers' do
        assigned_passenger = create(:passenger, booker_pks: [tm.id], company: company)
        another_tm = create(:travelmanager, active: false, company: company)
        another_passenger = create(:passenger, booker_pks: [another_tm.id], company: company)

        login_to_app_as(tm.email)
        passengers_page.load

        expect(passengers_page).to have_passengers(text: passenger.email)
        expect(passengers_page).to have_passengers(text: assigned_passenger.email)
        expect(passengers_page).to have_passengers(text: another_tm.email)
        expect(passengers_page).to have_passengers(text: another_passenger.email)

        expect(passengers_page).to have_total_passengers(text: 6)
        expect(passengers_page).to have_active_passengers(text: 5)
      end
    end
  end

  scenario 'Stats and Diagrams' do
    passenger = create(:passenger, company: company)
    orders_date = Time.zone.now.beginning_of_month

    Timecop.freeze(orders_date.prev_month) do
      create(:booking, :completed, :scheduled, :with_charges, fare_quote: 1500, passenger: passenger)
      create(:booking, :completed, :with_charges, fare_quote: 1500, passenger: passenger)
      create(:booking, :cancelled, :scheduled, :with_charges, fare_quote: 2500, passenger: passenger)
    end

    Timecop.freeze(orders_date) do
      create(:booking, :completed, :with_charges, fare_quote: 3500, passenger: passenger)
      create(:booking, :cancelled, :with_charges, fare_quote: 500, passenger: passenger)
    end

    login_to_app_as(passenger.email)
    passengers_page.load

    passenger_record = passengers_page.get_passenger_by_email(passenger.email)
    passenger_record.open_details
    expect(passenger_record).to have_details

    expect(passenger_record.details).to be_visible
    passenger_record.details.daily_orders_chart.hover_day(orders_date.day)
    expect(passenger_record.details.daily_orders_chart.tooltip.text).to include('Previous: 2', 'Current: 1')

    passenger_record.details.daily_spend_chart.hover_day(orders_date.day)
    expect(passenger_record.details.daily_spend_chart.tooltip.text).to include('Previous: 30', 'Current: 35')
  end

  scenario 'Pagination' do
    create_list(:passenger, 14, company: company)

    login_to_app_as(company.admin.email)
    passengers_page.load

    expect(passengers_page).to have_passengers(count: 10)
    passengers_page.pagination.select_page(2)
    expect(passengers_page).to have_passengers(count: 5)
  end

  scenario 'Search' do
    first_pass = create(:passenger, first_name: 'Kristi', last_name: 'Thorington', email: 'athorington1t@foxnews.com', phone: '+447449518011', company: company)
    second_pass = create(:passenger, first_name: 'Brunhilda', last_name: 'Hadwick', email: 'bhadwik@foxnews.com', phone: '+6956226767', company: company)
    third_pass = create(:passenger, first_name: 'Forest', last_name: 'Laddss', email: 'ladds@mail.io', phone: '+447476702252', company: company)
    fourth_pass = create(:passenger, first_name: 'Kristi', last_name: 'Wiggington', email: 'kwiggingtong@typepad.com', phone: '+814402888270', company: company)

    login_to_app_as(company.admin.email)
    passengers_page.load

    # Partially match by name
    passengers_page.search_field.set('Krist')
    wait_until_true { passengers_page.has_passengers?(count: 2) }
    expect(passengers_page.passengers.first).to have_passenger_surname(text: first_pass.last_name)
    expect(passengers_page.passengers.second).to have_passenger_surname(text: fourth_pass.last_name)

    # Full name search
    passengers_page.search_field.set('Kristi Wiggington')
    wait_until_true { passengers_page.has_passengers?(count: 1) }
    expect(passengers_page.passengers.first).to have_passenger_surname(text: fourth_pass.last_name)

    # Partially Email
    passengers_page.search_field.set('foxnews.')
    wait_until_true { passengers_page.has_passengers?(count: 2) }
    expect(passengers_page.passengers.first).to have_passenger_surname(text: second_pass.last_name)
    expect(passengers_page.passengers.second).to have_passenger_surname(text: first_pass.last_name)

    # Full email
    passengers_page.search_field.set('adds@mail.io')
    wait_until_true { passengers_page.has_passengers?(count: 1) }
    expect(passengers_page.passengers.first).to have_passenger_surname(text: third_pass.last_name)

    # Partially Phone number
    passengers_page.search_field.set('767')
    wait_until_true { passengers_page.has_passengers?(count: 2) }
    expect(passengers_page.passengers.first).to have_passenger_surname(text: second_pass.last_name)
    expect(passengers_page.passengers.second).to have_passenger_surname(text: third_pass.last_name)

    # Full Phone number
    passengers_page.search_field.set('814402888270')
    wait_until_true { passengers_page.has_passengers?(count: 1) }
    expect(passengers_page.passengers.first).to have_passenger_surname(text: fourth_pass.last_name)

    # Non Existed
    passengers_page.search_field.set('non')
    expect(passengers_page).to have_text('No results found')
    expect(passengers_page).to have_no_passengers
  end
end
