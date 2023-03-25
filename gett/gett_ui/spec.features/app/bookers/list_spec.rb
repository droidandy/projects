require 'features_helper'

feature 'Bookers Page' do
  let(:bookers_page) { Pages::App.bookers }
  let(:company)      { create(:company, :enterprise) }

  feature 'as member with role Booker I can' do
    let(:booker)          { create(:booker, company: company) }
    let!(:another_booker) { create(:booker, company: company) }

    scenario 'see only my profile and can not export' do
      login_to_app_as(booker.email)
      bookers_page.load
      expect(bookers_page).to have_no_export_button
      expect(bookers_page).to have_bookers(count: 1)
    end
  end

  feature 'as member with role Finance I can' do
    let(:finance)          { create(:finance, company: company) }
    let!(:another_finance) { create(:finance, company: company) }

    scenario 'see only my profile and can not export' do
      login_to_app_as(finance.email)
      bookers_page.load
      expect(bookers_page).to have_no_export_button
      expect(bookers_page).to have_bookers(count: 1)
    end
  end

  feature 'as member with role Admin I can' do
    let(:admin) { create(:admin, company: company) }

    scenario 'see and export all bookers' do
      booker = create(:booker, company: company)
      another_admin = create(:admin, company: company)
      finance = create(:finance, company: company)
      login_to_app_as(admin.email)

      bookers_page.load
      expect(bookers_page).to have_export_button
      expect(bookers_page).to have_bookers(count: 5)
      expect(bookers_page).to have_bookers(text: booker.email)
      expect(bookers_page).to have_bookers(text: another_admin.email)
      expect(bookers_page).to have_bookers(text: finance.email)
    end
  end

  feature 'as member with role Travel Manager I can' do
    let(:travelmanager) { create(:travelmanager, company: company) }

    scenario 'see and export all bookers' do
      booker = create(:booker, company: company)
      another_travelmanager = create(:travelmanager, company: company)
      finance = create(:finance, company: company)
      login_to_app_as(travelmanager.email)

      bookers_page.load
      expect(bookers_page).to have_export_button
      expect(bookers_page).to have_bookers(count: 5)
      expect(bookers_page).to have_bookers(text: booker.email)
      expect(bookers_page).to have_bookers(text: another_travelmanager.email)
      expect(bookers_page).to have_bookers(text: finance.email)
    end
  end

  scenario 'Stats and Diagrams', priority: :low do
    passenger = create(:passenger, company: company)
    booker = create(:booker, company: company)
    orders_date = Time.zone.now.beginning_of_month

    Timecop.freeze(orders_date.prev_month) do
      create(:booking, :completed, :scheduled, :with_charges, fare_quote: 1500, passenger: passenger, booker: booker)
      create(:booking, :completed, :with_charges, fare_quote: 2500, passenger: booker)
      create(:booking, :completed, :with_charges, fare_quote: 1500, passenger: passenger)
      create(:booking, :cancelled, :scheduled, :with_charges, fare_quote: 2500, passenger: booker)
    end

    Timecop.freeze(orders_date) do
      create(:booking, :completed, :with_charges, fare_quote: 3500, passenger: passenger, booker: booker)
      create(:booking, :completed, :with_charges, fare_quote: 2700, passenger: passenger)
      create(:booking, :cancelled, :with_charges, fare_quote: 500, passenger: passenger)
    end

    login_to_app_as(booker.email)
    bookers_page.load
    bookers_record = bookers_page.get_booker_by_email(booker.email)
    bookers_record.open_details
    expect(bookers_record.details).to be_visible
    bookers_record.details.daily_orders_chart.hover_day(orders_date.day)
    expect(bookers_record.details.daily_orders_chart.tooltip.text).to include('Current: 1 Previous: 2')

    bookers_record.details.daily_spend_chart.hover_day(orders_date.day)
    expect(bookers_record.details.daily_spend_chart.tooltip.text).to include('Current: 35 Previous: 40')
  end

  scenario 'Pagination' do
    create_list(:booker, 14, company: company)
    login_to_app_as(company.admin.email)
    bookers_page.load
    expect(bookers_page).to have_bookers(count: 10)
    wait_until_true { bookers_page.has_pagination? }
    bookers_page.pagination.select_page(2)
    expect(bookers_page).to have_bookers(count: 5)
  end

  scenario 'Search' do
    first_booker = create(:booker, first_name: 'Kristi', last_name: 'Thorington', email: 'athorington1t@foxnews.com', phone: '+447449518011', company: company)
    second_booker = create(:finance, first_name: 'Brunhilda', last_name: 'Hadwick', email: 'bhadwik@foxnews.com', phone: '+6956226767', company: company)
    third_booker = create(:admin, first_name: 'Forest', last_name: 'Laddss', email: 'ladds@mail.io', phone: '+447476702252', company: company)
    fourth_booker = create(:travelmanager, first_name: 'Kristi', last_name: 'Wiggington', email: 'kwiggingtong@typepad.com', phone: '+814402888270', company: company)

    company.admin.update(email: 'fake_mail@mail.net')
    login_to_app_as(company.admin.email)
    bookers_page.load

    # Partially match by name
    bookers_page.search_field.set('Krist')
    expect(bookers_page).to have_bookers(count: 2)
    expect(bookers_page.bookers.first).to have_booker_surname(text: first_booker.last_name)
    expect(bookers_page.bookers.second).to have_booker_surname(text: fourth_booker.last_name)

    # Full name search
    bookers_page.search_field.set('Kristi Wiggington')
    expect(bookers_page).to have_bookers(count: 1)
    expect(bookers_page.bookers.first).to have_booker_surname(text: fourth_booker.last_name)

    # Partially Email
    bookers_page.search_field.set('foxnews.')
    expect(bookers_page).to have_bookers(count: 2)
    expect(bookers_page.bookers.first).to have_booker_surname(text: first_booker.last_name)
    expect(bookers_page.bookers.second).to have_booker_surname(text: second_booker.last_name)

    # Full email
    bookers_page.search_field.set('adds@mail.io')
    expect(bookers_page).to have_bookers(count: 1)
    expect(bookers_page.bookers.first).to have_booker_surname(text: third_booker.last_name)

    # Partially Phone number
    bookers_page.search_field.set('767')
    expect(bookers_page).to have_bookers(count: 2)
    expect(bookers_page.bookers.first).to have_booker_surname(text: second_booker.last_name)
    expect(bookers_page.bookers.second).to have_booker_surname(text: third_booker.last_name)

    # Full Phone number
    bookers_page.search_field.set('814402888270')
    expect(bookers_page).to have_bookers(count: 1)
    expect(bookers_page.bookers.first).to have_booker_surname(text: fourth_booker.last_name)

    # Non Existed
    bookers_page.search_field.set('non')
    expect(bookers_page).to have_text('No results found')
    expect(bookers_page).to have_no_bookers
  end
end
