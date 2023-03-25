require 'features_helper'

feature 'Edit BBC Passenger' do
  let(:auth_page)           { Pages::Auth.login }
  let(:passengers_page)     { Pages::App.passengers }
  let(:edit_passenger_page) { Pages::App.edit_passenger }
  let(:bookers_page)        { Pages::App.bookers }
  let(:company)             { create(:company, :bbc) }
  let(:departments)         { create_list(:department, 2, company: company) }
  let(:work_roles)          { create_list(:work_role, 2, company: company) }

  context 'Passenger' do
    feature 'as Freelancer' do
      let(:user) { create(:passenger, :bbc_freelancer, company: company) }
      include_examples "edit self BBC passenger's profile"
    end

    feature 'as ThinPD' do
      let(:user) { create(:passenger, :bbc_thin_pd, company: company) }
      include_examples "edit self BBC passenger's profile"
    end

    feature 'as FullPD' do
      let(:user) { create(:passenger, :bbc_full_pd, company: company) }
      include_examples "edit self BBC passenger's profile"
    end
  end

  context 'Booker', priority: :low do
    feature 'as Freelancer' do
      let(:user) { create(:booker, :bbc_freelancer, company: company) }
      include_examples "edit self BBC passenger's profile"
    end

    feature 'as ThinPD' do
      let(:user) { create(:booker, :bbc_thin_pd, company: company) }
      include_examples "edit self BBC passenger's profile"
    end

    feature 'as FullPD' do
      let(:user) { create(:booker, :bbc_full_pd, company: company) }
      include_examples "edit self BBC passenger's profile"
    end
  end

  feature 'Sign Passenger Declaration' do
    let(:passenger) { create(:passenger, :bbc_temp_pd, company: company) }
    let(:thin_pd_declaration) do
      'I certify that the information
       I have provided here accurately states my normal home address and normal place of work as required within the Late Night/Early Morning transport policy.'
    end

    let(:full_pd_declaration) do
      'Passenger Declaration Your journey from 167 Fleet St, London EC4A 2EA, UK to 312 Vauxhall Bridge Rd, Westminster, London SW1V 1AA, UK has been calculated as (\d+.*) miles.
       The estimated cost of this journey is £(\d+.*) of which the cost beyond the 40 mile limit is calculated as £0.00.
       The cost will be reduced if the vehicle is shared. I agree that:
       I will share a vehicle with another BBC member of staff if required, within the rules of the Cab-Share scheme.
       I will authorise the BBC to deduct from my salary the excess distance cost of £0.00, less any deduction for cab-sharing for any Late night/early morning transport journey.
       I authorise the BBC to deduct from my salary the full cost of any Home to work/work to home journey that falls outside the Late night/early morning hours.
       I further authorise the BBC, for any work to work journey over 40 miles, to deduct from my salary the over 40 miles portion of that journey at £1.8 per mile.
       I understand that if I believe that an out of hours Home to work/Work to home journey was necessary due to exceptional reasons,
       I can contact my divisional authoriser: https://intranet.gateway.bbc.co.uk/travel-and-delivery/taxis/Pages/passenger-declaration-help.aspx to see if they concur and that they may agree that the cost should be charged to the BBC and not deducted from my salary.
       I understand that a passenger declaration is required for minicab journeys to/from my home to ensure that the BBC is meeting its tax obligations, that my home address is required as part of this declaration and is essential in order to collect or drop me off at my home address.
       I understand that the prefix of my home address may also be used for verification purposes to ensure that the BBC is meeting its tax obligations with regard to the use of work/work minicabs to/from employees’ home addresses. Read more about the use of personal data for travel bookings.
       I certify that the information I have provided here accurately states my normal home address and normal place of work as required within the Late Night/Early Morning transport policy. I Accept the Passenger Declaration'
    end

    before do
      login_to_app_as(passenger.email)
      edit_passenger_page.load(id: passenger.id)
      expect(edit_passenger_page.accept_declaration).not_to be_checked
    end

    scenario 'as ThinPD' do
      edit_passenger_page.accept_declaration.click
      expect(edit_passenger_page.accept_declaration).to be_checked
      expect(edit_passenger_page).to have_passenger_declaration(text: thin_pd_declaration.squish)
      edit_passenger_page.submit
      wait_until_true { passengers_page.loaded? }
      edit_passenger_page.load(id: passenger.id)
      expect(edit_passenger_page.accept_declaration).to be_checked
      expect(edit_passenger_page).to have_passenger_declaration
      expect(edit_passenger_page).to have_pd_expiry_date(text: (Time.current + 1.year).strftime('%d/%m/%Y'))
    end

    scenario 'as FullPD' do
      edit_passenger_page.enable_travel_to_from_home.click
      expect(edit_passenger_page.accept_declaration).to be_disabled
      expect(edit_passenger_page.home_address).not_to be_disabled

      set_address_headers '312 Vauxhall Bridge Rd, Westminster, London SW1V 1AA, UK'
      set_mock_header google_maps: { distance_matrix: { distance: 3.1 } }
      set_mock_header one_transport: { job_quote: { price: 1277 } }
      edit_passenger_page.home_address.select('312 Vauxhall Bridge Rd')
      wait_until_true { !edit_passenger_page.accept_declaration.disabled? }
      expect(edit_passenger_page.accept_declaration).not_to be_disabled
      edit_passenger_page.accept_declaration.click

      expect(edit_passenger_page).to have_passenger_declaration(text: 'Your journey from', wait: 5)
      expect(edit_passenger_page.passenger_declaration.text).to match(Regexp.new(full_pd_declaration.squish))
      edit_passenger_page.submit
      wait_until_true { passengers_page.loaded? }
      edit_passenger_page.load(id: passenger.id)
      expect(edit_passenger_page.accept_declaration).to be_checked
      expect(edit_passenger_page).to have_passenger_declaration
      expect(edit_passenger_page).to have_pd_expiry_date(text: (Time.current + 1.year).strftime('%d/%m/%Y'))
    end
  end

  scenario 'deactivated passenger can not sign in', priority: :low do
    passenger = create(:passenger, :bbc_thin_pd, company: company)
    login_to_app_as(company.admin.email)
    edit_passenger_page.load(id: passenger.id)

    edit_passenger_page.active.click
    edit_passenger_page.submit

    wait_until_true { passengers_page.loaded? }
    passengers_page.logout

    wait_until_true { auth_page.loaded? }
    auth_page.login_as(passenger.email)
    expect(auth_page).to have_error_message(text: 'Your account has been deactivated')
  end

  feature 'Send mail with activation account link', priority: :low do
    let(:passenger)             { create(:passenger, :bbc_thin_pd, company: company) }
    let(:booker)                { create(:booker, :bbc_thin_pd, company: company) }
    let(:activate_account_page) { Pages::Auth.set_password }
    let(:new_booking_page)      { Pages::App.new_booking }
    let(:new_password)          { 'P!ssword' }

    before do
      login_to_app_as(booker.email)
      edit_passenger_page.load(id: passenger.id)
    end

    scenario 'using OnBoarding switcher' do
      edit_passenger_page.onboarding.click
      expect(edit_passenger_page.onboarding).to be_checked
      edit_passenger_page.submit

      passengers_page.logout
      wait_until_true { auth_page.loaded? }

      activate_account_url = UITest.get_url_with_token_from_email(passenger.email)
      visit activate_account_url
      wait_until_true { activate_account_page.loaded? }

      activate_account_page.password.set(new_password)
      activate_account_page.password_confirmation.set(new_password)
      activate_account_page.set_password_button.click

      wait_until_true { new_booking_page.loaded? }
      expect(new_booking_page).to have_welcome_modal
      new_booking_page.welcome_modal.close
      new_booking_page.logout

      login_to_app_as(booker.email)
      edit_passenger_page.load(id: passenger.id)
      expect(edit_passenger_page).to have_no_onboarding
      expect(edit_passenger_page).to have_text('Onboarded')
    end

    scenario 'using ReInvite button' do
      edit_passenger_page.reinvite_button.click
      edit_passenger_page.cancel_button.click

      passengers_page.logout
      wait_until_true { auth_page.loaded? }

      activate_account_url = UITest.get_url_with_token_from_email(passenger.email)
      visit activate_account_url
      wait_until_true { activate_account_page.loaded? }

      activate_account_page.password.set(new_password)
      activate_account_page.password_confirmation.set(new_password)
      activate_account_page.set_password_button.click

      wait_until_true { new_booking_page.loaded? }
      expect(new_booking_page).to have_no_welcome_modal
    end
  end
end
