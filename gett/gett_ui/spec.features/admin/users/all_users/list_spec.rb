require 'features_helper'

feature 'All Users Page', priority: :low do
  let(:users_page) { Pages::Admin.all_users }
  let(:company)    { create(:company, :enterprise) }

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

    login_as_super_admin
    users_page.load

    users_record = users_page.get_user_by_email(passenger.email)
    users_record.open_details
    expect(users_record.details).to be_visible
    users_record.details.daily_orders_chart.hover_day(orders_date.day)
    expect(users_record.details.daily_orders_chart.tooltip.text).to include('Current: 2 Previous: 2')
    users_record.details.daily_spend_chart.hover_day(orders_date.day)
    expect(users_record.details.daily_spend_chart.tooltip.text).to include('Current: 62 Previous: 30')

    booker_record = users_page.get_user_by_email(booker.email)
    booker_record.open_details
    expect(booker_record.details).to be_visible
    booker_record.details.daily_orders_chart.hover_day(orders_date.day)
    expect(booker_record.details.daily_orders_chart.tooltip.text).to include('Current: 0 Previous: 1')

    booker_record.details.daily_spend_chart.hover_day(orders_date.day)
    expect(booker_record.details.daily_spend_chart.tooltip.text).to include('Current: 0 Previous: 25')
  end

  scenario 'Pagination' do
    create_list(:member, 27, company: company)
    login_as_super_admin
    users_page.load
    expect(users_page).to have_users(count: 25)
    users_page.pagination.select_page(2)
    expect(users_page).to have_users(count: 3)
  end

  scenario 'Search' do
    second_company = create(:company, :enterprise)
    first_user = create(:booker, first_name: 'Kristi', last_name: 'Thorington', email: 'athorington1t@foxnews.com', company: second_company)
    second_user = create(:finance, first_name: 'Brunhilda', last_name: 'Hadwick', email: 'bhadwik@foxnews.com', company: company)
    third_user = create(:admin, first_name: 'Forest', last_name: 'Laddss', email: 'ladds@mail.io', company: second_company)
    fourth_user = create(:travelmanager, first_name: 'Kristi', last_name: 'Wiggington', email: 'kwiggingtong@typepad.com', company: company)

    login_as_super_admin
    users_page.load

    # Partially match by name
    users_page.search_field.set('Krist')
    expect(users_page).to have_users(count: 2)
    expect(users_page.users.first).to have_user_surname(text: first_user.last_name)
    expect(users_page.users.second).to have_user_surname(text: fourth_user.last_name)

    # Full email
    users_page.search_field.set('adds@mail.io')
    expect(users_page).to have_users(count: 1)
    expect(users_page.users.first).to have_user_surname(text: third_user.last_name)

    # Partially Email
    users_page.search_field.set('foxnews.')
    expect(users_page).to have_users(count: 2)
    expect(users_page.users.first).to have_user_surname(text: first_user.last_name)
    expect(users_page.users.second).to have_user_surname(text: second_user.last_name)

    # Non Existed
    users_page.search_field.set('non')
    expect(users_page).to have_text('No results found')
    expect(users_page).to have_no_users

    # Company Name
    users_page.search_field.set(second_company.name)
    expect(users_page).to have_users(count: 3)
  end
end
