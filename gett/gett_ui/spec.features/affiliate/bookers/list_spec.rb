require 'features_helper'

feature 'Affiliate Bookers Page' do
  let(:bookers_page) { Pages::Affiliate.bookers }
  let(:company)      { create(:company, :affiliate) }

  scenario 'Stats and Diagrams' do
    booker = create(:booker, company: company)
    orders_date = Time.zone.now.beginning_of_month

    Timecop.freeze(orders_date.prev_month) do
      create(:booking, :completed, :scheduled, :with_charges, :without_passenger, fare_quote: 1500, booker: booker)
      create(:booking, :completed, :with_charges, :without_passenger, fare_quote: 1500, booker: booker)
      create(:booking, :cancelled, :scheduled, :with_charges, :without_passenger, fare_quote: 2500, booker: booker)
    end

    Timecop.freeze(orders_date) do
      create(:booking, :completed, :with_charges, :without_passenger, fare_quote: 3500, booker: booker)
      create(:booking, :cancelled, :with_charges, :without_passenger, fare_quote: 500, booker: booker)
    end

    login_to_affiliate_as(booker.email)
    bookers_page.load
    wait_until_true { bookers_page.bookers.present? }
    bookers_record = bookers_page.get_booker_by_email(booker.email)
    bookers_record.open_details
    expect(bookers_record.details).to be_visible
    bookers_record.details.daily_orders_chart.hover_day(orders_date.day)
    expect(bookers_record.details.daily_orders_chart.tooltip.text).to include('Previous: 2', 'Current: 1')
  end

  scenario 'Pagination' do
    create_list(:booker, 14, company: company)
    login_to_affiliate_as(company.admin.email)
    bookers_page.load
    expect(bookers_page).to have_bookers(count: 10)
    bookers_page.pagination.select_page(2)
    expect(bookers_page).to have_bookers(count: 5)
  end

  scenario 'Search' do
    first_booker = create(:booker, first_name: 'Kristi', last_name: 'Thorington', email: 'athorington1t@foxnews.com', phone: '+447449518011', company: company)
    second_booker = create(:booker, first_name: 'Brunhilda', last_name: 'Hadwick', email: 'bhadwik@foxnews.com', phone: '+6956226767', company: company)
    third_booker = create(:admin, first_name: 'Forest', last_name: 'Laddss', email: 'ladds@mail.io', phone: '+447476702252', company: company)
    fourth_booker = create(:admin, first_name: 'Kristi', last_name: 'Wiggington', email: 'kwiggingtong@typepad.com', phone: '+814402888270', company: company)

    login_to_affiliate_as(company.admin.email)
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
    bookers_page.search_field.set('+814402888270')
    expect(bookers_page).to have_bookers(count: 1)
    expect(bookers_page.bookers.first).to have_booker_surname(text: fourth_booker.last_name)

    # Non Existed
    bookers_page.search_field.set('non')
    expect(bookers_page).to have_text('No results found')
    expect(bookers_page).to have_no_bookers
  end
end
