require 'features_helper'

feature 'New Booking - BBC Travel Policy' do
  let(:company)                  { create(:company, :bbc) }
  let(:new_booking_page)         { Pages::App.new_booking }
  let(:baker_street_address)     { '221b Baker Street, London, UK' }
  let(:mercedes_glasgow_address) { 'Mercedes-Benz of Glasgow' }
  let(:update_pd_text)           { 'Please update your passenger declaration.' }
  let(:no_pd_found_text)         { 'No Passenger Declaration found, passenger is required to go to Passenger -> Search name -> Click On Name -> Click Edit and Complete all relevant fields -> Click Update Passenger to complete' }
  let(:outside_lnemt_text)       { "This Journey Falls Outside of policy hours, the full charge will be charged directly to the Passenger's Salary" }
  let(:policy_mileage_limit)     { company.custom_attributes['travel_policy_mileage_limit'].to_f }
  let(:miles_exceed_text)        { "This booking exceeds #{policy_mileage_limit} miles. Element over #{policy_mileage_limit} miles will be deducted from Salary. Please consider Rail or Car Hire which may be more cost effective." }
  let(:less_than_policy)         { policy_mileage_limit - 0.1 }
  let(:more_than_policy)         { policy_mileage_limit + 0.1 }

  feature 'Guest Passenger' do
    before do
      login_to_app_as(company.admin.email)
      wait_until_true { new_booking_page.loaded? }
    end

    scenario 'W2W less than 40 miles trip fully paid by company' do
      new_booking_page.passenger_name.select(Faker::Name.first_name, autocomplete: false)
      new_booking_page.phone_number.set(Faker::PhoneNumber.phone_number(:gb))

      set_mock_header google_maps: { distance_matrix: { distance: less_than_policy} }
      new_booking_page.destination_address.select(baker_street_address)
      new_booking_page.vehicles.wait_until_available
      new_booking_page.vehicles.standard.click

      expect(new_booking_page.vehicles.description).to have_no_total_cost_to_bbc
      expect(new_booking_page.vehicles.description).to have_no_salary_charge
    end

    scenario 'W2W more than 40 miles trip fully paid by company' do
      new_booking_page.passenger_name.select(Faker::Name.first_name, autocomplete: false)
      new_booking_page.phone_number.set(Faker::PhoneNumber.phone_number(:gb), autocomplete: false)

      set_mock_header google_maps: { distance_matrix: { distance: more_than_policy} }
      new_booking_page.destination_address.select(mercedes_glasgow_address)
      new_booking_page.vehicles.wait_until_available
      new_booking_page.vehicles.standard.click

      expect(new_booking_page.vehicles.description).to have_total_cost
      expect(new_booking_page.vehicles.description).to have_no_total_cost_to_bbc
      expect(new_booking_page.vehicles.description).to have_no_salary_charge
    end
  end

  feature 'Freelancer' do
    let(:passenger) { create(:passenger, :bbc_freelancer, company: company) }

    before do
      login_to_app_as(passenger.email)
      wait_until_true { new_booking_page.loaded? }
    end

    scenario 'W2W less than 40 miles trip fully paid by company' do
      set_mock_header google_maps: { distance_matrix: { distance: less_than_policy} }
      new_booking_page.destination_address.select(baker_street_address)
      new_booking_page.vehicles.wait_until_available
      new_booking_page.vehicles.standard.click

      expect(new_booking_page.vehicles.description).to have_no_total_cost_to_bbc
      expect(new_booking_page.vehicles.description).to have_no_salary_charge
    end

    scenario 'W2W more than 40 miles trip fully paid by company' do
      set_mock_header google_maps: { distance_matrix: { distance: more_than_policy} }
      new_booking_page.destination_address.select(mercedes_glasgow_address)
      new_booking_page.vehicles.wait_until_available
      new_booking_page.vehicles.standard.click

      expect(new_booking_page.vehicles.description).to have_total_cost
      expect(new_booking_page.vehicles.description).to have_no_total_cost_to_bbc
      expect(new_booking_page.vehicles.description).to have_no_salary_charge
    end
  end

  feature 'Temp PD' do
    let(:passenger) { create(:passenger, :bbc_temp_pd, company: company) }

    scenario 'can not make order if PD is expired' do
      passenger = create(:passenger, :bbc_temp_pd, :pd_expired, company: company)
      login_to_app_as(passenger.email)
      expect(new_booking_page).to have_notification(text: update_pd_text)

      set_mock_header google_maps: { distance_matrix: { distance: less_than_policy} }
      new_booking_page.destination_address.select(baker_street_address)
      new_booking_page.vehicles.wait_until_available
      new_booking_page.vehicles.standard.click

      expect(new_booking_page).to have_warning(text: no_pd_found_text)
      expect(new_booking_page).to have_save_button(disabled: true)
    end

    scenario 'W2W less than 40 miles trip fully paid by company' do
      login_to_app_as(passenger.email)
      wait_until_true { new_booking_page.loaded? }

      set_mock_header google_maps: { distance_matrix: { distance: less_than_policy} }
      new_booking_page.destination_address.select(baker_street_address)
      new_booking_page.vehicles.wait_until_available
      new_booking_page.vehicles.standard.click

      expect(new_booking_page.vehicles.description).to have_no_total_cost_to_bbc
      expect(new_booking_page.vehicles.description).to have_no_salary_charge
    end

    scenario 'W2W more than 40 miles trip is disabled' do
      login_to_app_as(passenger.email)
      wait_until_true { new_booking_page.loaded? }

      set_mock_header google_maps: { distance_matrix: { distance: more_than_policy} }
      new_booking_page.destination_address.select(mercedes_glasgow_address)
      new_booking_page.vehicles.wait_until_available
      new_booking_page.vehicles.standard.click

      expect(new_booking_page).to have_warning(text: 'You can only make Work to Work journey less than 40.0 miles.')
      expect(new_booking_page).to have_save_button(disabled: true)
    end
  end

  feature 'ThinPD' do
    let(:passenger) { create(:passenger, :bbc_thin_pd, company: company) }

    scenario 'can not make order if PD is expired' do
      passenger = create(:passenger, :bbc_thin_pd, :pd_expired, company: company)

      login_to_app_as(passenger.email)
      expect(new_booking_page).to have_notification(text: update_pd_text)

      new_booking_page.destination_address.select(baker_street_address)
      new_booking_page.vehicles.wait_until_available
      new_booking_page.vehicles.standard.click

      expect(new_booking_page).to have_warning(text: no_pd_found_text)
      expect(new_booking_page).to have_save_button(disabled: true)
    end

    scenario 'W2W less than 40 miles trip fully paid by company' do
      login_to_app_as(passenger.email)
      wait_until_true { new_booking_page.loaded? }

      new_booking_page.destination_address.select(baker_street_address)
      new_booking_page.vehicles.wait_until_available
      new_booking_page.vehicles.standard.click

      expect(new_booking_page.vehicles.description).to have_no_total_cost_to_bbc
      expect(new_booking_page.vehicles.description).to have_no_salary_charge
    end

    scenario 'W2W more than 40 miles trip - salary charge for distance over 40 miles' do
      login_to_app_as(passenger.email)
      wait_until_true { new_booking_page.loaded? }

      set_mock_header google_maps: { distance_matrix: { distance: more_than_policy} }
      new_booking_page.destination_address.select(mercedes_glasgow_address)
      new_booking_page.vehicles.wait_until_available
      new_booking_page.vehicles.standard.click

      expect(new_booking_page).to have_warning(text: miles_exceed_text)
      expect(new_booking_page.vehicles.description).to have_no_total_cost_to_bbc
      expect(new_booking_page.vehicles.description).to have_total_cost
      expect(new_booking_page.vehicles.description).to have_salary_charge
    end

    scenario 'W2W more than 40 miles (Exemption: WW Salary Charges enabled)' do
      passenger = create(:passenger, :bbc_thin_pd, exemption_ww_charges: true, company: company)
      login_to_app_as(passenger.email)

      wait_until_true { new_booking_page.loaded? }

      set_mock_header google_maps: { distance_matrix: { distance: more_than_policy} }
      new_booking_page.destination_address.select(mercedes_glasgow_address)
      new_booking_page.vehicles.wait_until_available
      new_booking_page.vehicles.standard.click

      expect(new_booking_page.vehicles.description).to have_no_total_cost_to_bbc
      expect(new_booking_page.vehicles.description).to have_total_cost
      expect(new_booking_page.vehicles.description).to have_no_salary_charge
    end
  end

  feature 'FullPD' do
    let(:passenger) { create(:passenger, :bbc_full_pd, company: company) }

    scenario 'can not make order if PD is expired' do
      passenger = create(:passenger, :bbc_full_pd, :pd_expired, company: company)

      login_to_app_as(passenger.email)
      expect(new_booking_page).to have_notification(text: update_pd_text)

      new_booking_page.destination_address.select(baker_street_address)
      new_booking_page.vehicles.wait_until_available
      new_booking_page.vehicles.standard.click

      expect(new_booking_page).to have_warning(text: no_pd_found_text)
      expect(new_booking_page).to have_save_button(disabled: true)
    end

    scenario 'W2W less than 40 miles trip fully paid by company' do
      login_to_app_as(passenger.email)
      wait_until_true { new_booking_page.loaded? }

      new_booking_page.destination_address.select(baker_street_address)
      new_booking_page.vehicles.wait_until_available
      new_booking_page.vehicles.standard.click

      expect(new_booking_page.vehicles.description).to have_no_total_cost_to_bbc
      expect(new_booking_page.vehicles.description).to have_no_salary_charge
    end

    scenario 'W2W more than 40 miles trip - salary charge for distance over 40 miles' do
      login_to_app_as(passenger.email)
      wait_until_true { new_booking_page.loaded? }

      set_mock_header google_maps: { distance_matrix: { distance: more_than_policy} }
      new_booking_page.destination_address.select(mercedes_glasgow_address)
      new_booking_page.vehicles.wait_until_available
      new_booking_page.vehicles.standard.click

      expect(new_booking_page).to have_warning(text: miles_exceed_text)
      expect(new_booking_page.vehicles.description).to have_no_total_cost_to_bbc
      expect(new_booking_page.vehicles.description).to have_total_cost
      expect(new_booking_page.vehicles.description).to have_salary_charge
    end

    scenario 'W2W more than 40 miles (Exemption: WW Salary Charges enabled)' do
      passenger = create(:passenger, :bbc_full_pd, exemption_ww_charges: true, company: company)
      login_to_app_as(passenger.email)

      wait_until_true { new_booking_page.loaded? }

      set_mock_header google_maps: { distance_matrix: { distance: more_than_policy} }
      new_booking_page.destination_address.select(mercedes_glasgow_address)
      new_booking_page.vehicles.wait_until_available
      new_booking_page.vehicles.standard.click

      expect(new_booking_page.vehicles.description).to have_no_total_cost_to_bbc
      expect(new_booking_page.vehicles.description).to have_total_cost
      expect(new_booking_page.vehicles.description).to have_no_salary_charge
    end

    feature 'Exemption: WH/HW Salary Charges is disabled; P11D is Disabled' do
      context 'W2H H2W outside LNEMT' do
        scenario '< 40 miles' do
          passenger = create(:passenger, :bbc_full_pd, :outside_lnemt, exemption_wh_hw_charges: false, exemption_p11d: false, company: company)

          login_to_app_as(passenger.email)
          wait_until_true { new_booking_page.loaded? }

          set_mock_header google_maps: { distance_matrix: { distance: less_than_policy} }
          new_booking_page.home_to_work_button.click
          new_booking_page.vehicles.wait_until_available
          new_booking_page.vehicles.standard.click

          expect(new_booking_page).to have_warning(text: outside_lnemt_text)
          expect(new_booking_page.vehicles.description).to have_no_total_cost_to_bbc
          expect(new_booking_page.vehicles.description).to have_no_total_cost
          expect(new_booking_page.vehicles.description).to have_salary_charge
        end

        scenario '> 40 miles' do
          passenger = create(:passenger, :bbc_full_pd, :outside_lnemt, :with_home_address_more_40_miles, exemption_wh_hw_charges: false, exemption_p11d: false, company: company)

          login_to_app_as(passenger.email)
          wait_until_true { new_booking_page.loaded? }

          set_mock_header google_maps: { distance_matrix: { distance: more_than_policy} }
          new_booking_page.work_to_home_button.click
          new_booking_page.vehicles.wait_until_available
          new_booking_page.vehicles.standard.click

          expect(new_booking_page).to have_warning(text: outside_lnemt_text)
          expect(new_booking_page.vehicles.description).to have_no_total_cost_to_bbc
          expect(new_booking_page.vehicles.description).to have_no_total_cost
          expect(new_booking_page.vehicles.description).to have_salary_charge
        end
      end

      context 'W2H H2W inside LNEMT' do
        scenario '< 40 miles' do
          passenger = create(:passenger, :bbc_full_pd, :inside_lnemt, exemption_wh_hw_charges: false, exemption_p11d: false, company: company)

          login_to_app_as(passenger.email)
          wait_until_true { new_booking_page.loaded? }

          set_mock_header google_maps: { distance_matrix: { distance: less_than_policy} }
          new_booking_page.home_to_work_button.click
          new_booking_page.vehicles.wait_until_available
          new_booking_page.vehicles.standard.click

          expect(new_booking_page).to have_no_warning
          expect(new_booking_page.vehicles.description).to have_total_cost_to_bbc
          expect(new_booking_page.vehicles.description).to have_p11_tax_liability
          expect(new_booking_page.vehicles.description).to have_no_total_cost
          expect(new_booking_page.vehicles.description).to have_no_salary_charge
        end

        scenario '> 40 miles' do
          passenger = create(:passenger, :bbc_full_pd, :inside_lnemt, :with_home_address_more_40_miles, exemption_wh_hw_charges: false, exemption_p11d: false, company: company)

          login_to_app_as(passenger.email)
          wait_until_true { new_booking_page.loaded? }

          set_mock_header google_maps: { distance_matrix: { distance: more_than_policy} }
          new_booking_page.work_to_home_button.click
          new_booking_page.vehicles.wait_until_available
          new_booking_page.vehicles.standard.click

          expect(new_booking_page).to have_warning(text: "A salary charge applies for more than PD agreed distance.")
          expect(new_booking_page.vehicles.description).to have_total_cost
          expect(new_booking_page.vehicles.description).to have_p11_tax_liability
          expect(new_booking_page.vehicles.description).to have_salary_charge
          expect(new_booking_page.vehicles.description).to have_no_total_cost_to_bbc
        end
      end
    end

    feature 'Exemption: WH/HW Salary Charges is Enabled; P11D is Disabled' do
      context 'W2H H2W outside LNEMT' do
        scenario '< 40 miles' do
          passenger = create(:passenger, :bbc_full_pd, :outside_lnemt, exemption_wh_hw_charges: true, exemption_p11d: false, company: company)

          login_to_app_as(passenger.email)
          wait_until_true { new_booking_page.loaded? }

          set_mock_header google_maps: { distance_matrix: { distance: less_than_policy} }
          new_booking_page.home_to_work_button.click
          new_booking_page.vehicles.wait_until_available
          new_booking_page.vehicles.standard.click

          expect(new_booking_page).to have_no_warning
          expect(new_booking_page.vehicles.description).to have_no_total_cost
          expect(new_booking_page.vehicles.description).to have_p11_tax_liability
          expect(new_booking_page.vehicles.description).to have_no_salary_charge
          expect(new_booking_page.vehicles.description).to have_total_cost_to_bbc
        end

        scenario '> 40 miles' do
          passenger = create(:passenger, :bbc_full_pd, :outside_lnemt, :with_home_address_more_40_miles, exemption_wh_hw_charges: true, exemption_p11d: false, company: company)

          login_to_app_as(passenger.email)
          wait_until_true { new_booking_page.loaded? }

          set_mock_header google_maps: { distance_matrix: { distance: more_than_policy} }
          new_booking_page.work_to_home_button.click
          new_booking_page.vehicles.wait_until_available
          new_booking_page.vehicles.standard.click

          expect(new_booking_page).to have_no_warning
          expect(new_booking_page.vehicles.description).to have_no_total_cost
          expect(new_booking_page.vehicles.description).to have_p11_tax_liability
          expect(new_booking_page.vehicles.description).to have_no_salary_charge
          expect(new_booking_page.vehicles.description).to have_total_cost_to_bbc
        end
      end

      context 'W2H H2W inside LNEMT' do
        scenario '< 40 miles' do
          passenger = create(:passenger, :bbc_full_pd, :inside_lnemt, exemption_wh_hw_charges: true, exemption_p11d: false, company: company)

          login_to_app_as(passenger.email)
          wait_until_true { new_booking_page.loaded? }

          set_mock_header google_maps: { distance_matrix: { distance: less_than_policy} }
          new_booking_page.home_to_work_button.click
          new_booking_page.vehicles.wait_until_available
          new_booking_page.vehicles.standard.click

          expect(new_booking_page).to have_no_warning
          expect(new_booking_page.vehicles.description).to have_no_total_cost
          expect(new_booking_page.vehicles.description).to have_p11_tax_liability
          expect(new_booking_page.vehicles.description).to have_no_salary_charge
          expect(new_booking_page.vehicles.description).to have_total_cost_to_bbc
        end

        scenario '> 40 miles' do
          passenger = create(:passenger, :bbc_full_pd, :inside_lnemt, :with_home_address_more_40_miles, exemption_wh_hw_charges: true, exemption_p11d: false, company: company)

          login_to_app_as(passenger.email)
          wait_until_true { new_booking_page.loaded? }

          set_mock_header google_maps: { distance_matrix: { distance: more_than_policy} }
          new_booking_page.work_to_home_button.click
          new_booking_page.vehicles.wait_until_available
          new_booking_page.vehicles.standard.click

          expect(new_booking_page).to have_no_warning
          expect(new_booking_page.vehicles.description).to have_no_total_cost
          expect(new_booking_page.vehicles.description).to have_p11_tax_liability
          expect(new_booking_page.vehicles.description).to have_no_salary_charge
          expect(new_booking_page.vehicles.description).to have_total_cost_to_bbc
        end
      end
    end

    feature 'Exemption: WH/HW Salary Charges is Enabled; P11D is Enabled' do
      context 'W2H H2W outside LNEMT' do
        scenario '< 40 miles' do
          passenger = create(:passenger, :bbc_full_pd, :outside_lnemt, exemption_wh_hw_charges: true, exemption_p11d: true, company: company)

          login_to_app_as(passenger.email)
          wait_until_true { new_booking_page.loaded? }

          set_mock_header google_maps: { distance_matrix: { distance: less_than_policy} }
          new_booking_page.home_to_work_button.click
          new_booking_page.vehicles.wait_until_available
          new_booking_page.vehicles.standard.click

          expect(new_booking_page).to have_no_warning
          expect(new_booking_page.vehicles.description).to have_total_cost
          expect(new_booking_page.vehicles.description).to have_no_p11_tax_liability
          expect(new_booking_page.vehicles.description).to have_no_salary_charge
          expect(new_booking_page.vehicles.description).to have_no_total_cost_to_bbc
        end

        scenario '> 40 miles' do
          passenger = create(:passenger, :bbc_full_pd, :outside_lnemt, :with_home_address_more_40_miles, exemption_wh_hw_charges: true, exemption_p11d: true, company: company)

          login_to_app_as(passenger.email)
          wait_until_true { new_booking_page.loaded? }

          set_mock_header google_maps: { distance_matrix: { distance: more_than_policy} }
          new_booking_page.work_to_home_button.click
          new_booking_page.vehicles.wait_until_available
          new_booking_page.vehicles.standard.click

          expect(new_booking_page).to have_no_warning
          expect(new_booking_page.vehicles.description).to have_total_cost
          expect(new_booking_page.vehicles.description).to have_no_p11_tax_liability
          expect(new_booking_page.vehicles.description).to have_no_salary_charge
          expect(new_booking_page.vehicles.description).to have_no_total_cost_to_bbc
        end
      end

      context 'W2H H2W inside LNEMT' do
        scenario '< 40 miles' do
          passenger = create(:passenger, :bbc_full_pd, :inside_lnemt, exemption_wh_hw_charges: true, exemption_p11d: true, company: company)

          login_to_app_as(passenger.email)
          wait_until_true { new_booking_page.loaded? }

          set_mock_header google_maps: { distance_matrix: { distance: less_than_policy} }
          new_booking_page.home_to_work_button.click
          new_booking_page.vehicles.wait_until_available
          new_booking_page.vehicles.standard.click

          expect(new_booking_page).to have_no_warning
          expect(new_booking_page.vehicles.description).to have_total_cost
          expect(new_booking_page.vehicles.description).to have_no_p11_tax_liability
          expect(new_booking_page.vehicles.description).to have_no_salary_charge
          expect(new_booking_page.vehicles.description).to have_no_total_cost_to_bbc
        end

        scenario '> 40 miles' do
          passenger = create(:passenger, :bbc_full_pd, :inside_lnemt, :with_home_address_more_40_miles, exemption_wh_hw_charges: true, exemption_p11d: true, company: company)

          login_to_app_as(passenger.email)
          wait_until_true { new_booking_page.loaded? }

          set_mock_header google_maps: { distance_matrix: { distance: more_than_policy} }
          new_booking_page.work_to_home_button.click
          new_booking_page.vehicles.wait_until_available
          new_booking_page.vehicles.standard.click

          expect(new_booking_page).to have_no_warning
          expect(new_booking_page.vehicles.description).to have_total_cost
          expect(new_booking_page.vehicles.description).to have_no_p11_tax_liability
          expect(new_booking_page.vehicles.description).to have_no_salary_charge
          expect(new_booking_page.vehicles.description).to have_no_total_cost_to_bbc
        end
      end
    end

    feature 'Exemption: WH/HW Salary Charges is Disabled; P11D is Enabled' do
      context 'W2H H2W outside LNEMT' do
        scenario '< 40 miles' do
          passenger = create(:passenger, :bbc_full_pd, :outside_lnemt, exemption_wh_hw_charges: false, exemption_p11d: true, company: company)

          login_to_app_as(passenger.email)
          wait_until_true { new_booking_page.loaded? }

          set_mock_header google_maps: { distance_matrix: { distance: less_than_policy} }
          new_booking_page.home_to_work_button.click
          new_booking_page.vehicles.wait_until_available
          new_booking_page.vehicles.standard.click

          expect(new_booking_page).to have_warning(text: outside_lnemt_text)
          expect(new_booking_page.vehicles.description).to have_salary_charge
          expect(new_booking_page.vehicles.description).to have_no_total_cost
          expect(new_booking_page.vehicles.description).to have_no_p11_tax_liability
          expect(new_booking_page.vehicles.description).to have_no_total_cost_to_bbc
        end

        scenario '> 40 miles' do
          passenger = create(:passenger, :bbc_full_pd, :outside_lnemt, :with_home_address_more_40_miles, exemption_wh_hw_charges: false, exemption_p11d: true, company: company)

          login_to_app_as(passenger.email)
          wait_until_true { new_booking_page.loaded? }

          set_mock_header google_maps: { distance_matrix: { distance: more_than_policy} }
          new_booking_page.work_to_home_button.click
          new_booking_page.vehicles.wait_until_available
          new_booking_page.vehicles.standard.click

          expect(new_booking_page).to have_warning(text: outside_lnemt_text)
          expect(new_booking_page.vehicles.description).to have_salary_charge
          expect(new_booking_page.vehicles.description).to have_no_total_cost
          expect(new_booking_page.vehicles.description).to have_no_p11_tax_liability
          expect(new_booking_page.vehicles.description).to have_no_total_cost_to_bbc
        end
      end

      context 'W2H H2W inside LNEMT' do
        scenario '< 40 miles' do
          passenger = create(:passenger, :bbc_full_pd, :inside_lnemt, exemption_wh_hw_charges: false, exemption_p11d: true, company: company)

          login_to_app_as(passenger.email)
          wait_until_true { new_booking_page.loaded? }

          set_mock_header google_maps: { distance_matrix: { distance: less_than_policy} }
          new_booking_page.home_to_work_button.click
          new_booking_page.vehicles.wait_until_available
          new_booking_page.vehicles.standard.click

          expect(new_booking_page).to have_no_warning
          expect(new_booking_page.vehicles.description).to have_total_cost
          expect(new_booking_page.vehicles.description).to have_no_p11_tax_liability
          expect(new_booking_page.vehicles.description).to have_no_salary_charge
          expect(new_booking_page.vehicles.description).to have_no_total_cost_to_bbc
        end

        scenario '> 40 miles' do
          passenger = create(:passenger, :bbc_full_pd, :inside_lnemt, :with_home_address_more_40_miles, exemption_wh_hw_charges: false, exemption_p11d: true, company: company)

          login_to_app_as(passenger.email)
          wait_until_true { new_booking_page.loaded? }

          set_mock_header google_maps: { distance_matrix: { distance: more_than_policy} }
          new_booking_page.work_to_home_button.click
          new_booking_page.vehicles.wait_until_available
          new_booking_page.vehicles.standard.click

          expect(new_booking_page).to have_warning(text: "A salary charge applies for more than PD agreed distance.")
          expect(new_booking_page.vehicles.description).to have_total_cost
          expect(new_booking_page.vehicles.description).to have_salary_charge
          expect(new_booking_page.vehicles.description).to have_no_p11_tax_liability
          expect(new_booking_page.vehicles.description).to have_no_total_cost_to_bbc
        end
      end
    end

    feature 'W2H H2W 10 miles Rule' do
      let(:passenger) { create(:passenger, :bbc_full_pd, :inside_lnemt, company: company) }

      before do
        login_to_app_as(passenger.email)
        wait_until_true { new_booking_page.loaded? }
      end

      scenario 'less 10 miles from any of passengers addresses should be count as normal W2H H2W ride' do
        set_mock_header google_maps: { distance_matrix: { distance: '9.9'} }
        new_booking_page.destination_address.select('220 Baker Street, London, UK')
        new_booking_page.journey_type.select('Work to Home')
        new_booking_page.vehicles.wait_until_available
        expect(new_booking_page).to have_no_warning
      end

      scenario 'more than 10 miles should change journey type to W2W' do
        set_mock_header google_maps: { details: { lat: 50.01001, address: 'Newbury Park, Ilford' } }
        set_mock_header google_maps: { distance_matrix: { distance: '10.1'} }
        new_booking_page.destination_address.select('Newbury Park, Ilford')
        new_booking_page.vehicles.wait_until_available
        new_booking_page.journey_type.select('Work to Home')
        new_booking_page.vehicles.wait_until_available

        expect(new_booking_page).to have_warning(text: "The pickup or destination change you\\'ve selected is greater than 10 miles from those indicated in your Passenger Declaration. The Journey Reason was changed to work to work.")
        expect(new_booking_page.journey_type.selected_options).to eql('Work to Work')

        new_booking_page.vehicles.standard.click
        expect(new_booking_page.vehicles.description).to have_total_cost
        expect(new_booking_page.vehicles.description).to have_no_salary_charge
        expect(new_booking_page.vehicles.description).to have_no_total_cost_to_bbc
      end
    end

    scenario 'W2H H2W where either PU or Drop off is Airport/Station' do
      passenger = create(:passenger, :bbc_full_pd, :inside_lnemt, company: company)
      airport_address = Address.create(PredefinedAddress.find(line: 'London City Airport Arrivals').values.except(:id, :additional_terms))
      passenger.update(home_address: airport_address)

      login_to_app_as(passenger.email)
      wait_until_true { new_booking_page.loaded? }

      new_booking_page.work_to_home_button.click
      new_booking_page.vehicles.wait_until_available
      new_booking_page.vehicles.standard.click

      expect(new_booking_page).to have_warning(text: "The Journey Reason was changed to work to work as one of the addresses is an Airport/Train Station.")
      expect(new_booking_page.journey_type.selected_options).to eql('Work to Work')
      expect(new_booking_page.vehicles.description).to have_total_cost
      expect(new_booking_page.vehicles.description).to have_no_salary_charge
      expect(new_booking_page.vehicles.description).to have_no_total_cost_to_bbc
    end

    scenario 'W2H H2W - No Stop Points' do
      passenger = create(:passenger, :bbc_full_pd, :inside_lnemt, company: company)

      login_to_app_as(passenger.email)
      wait_until_true { new_booking_page.loaded? }

      new_booking_page.work_to_home_button.click
      new_booking_page.vehicles.wait_until_available

      new_booking_page.add_stop_point.click
      expect(new_booking_page).to have_warning(text: 'Work to Home / Home to Work journeys are not allowed to have any vias. The Journey Reason was changed to work to work.')
      expect(new_booking_page.journey_type.selected_options).to eql('Work to Work')
    end

    scenario 'International Booking Rule' do
      passenger = create(:passenger, :bbc_full_pd, :inside_lnemt, company: company)

      login_to_app_as(passenger.email)
      wait_until_true { new_booking_page.loaded? }

      new_booking_page.journey_type.select('Work to Home')
      new_booking_page.international.click
      new_booking_page.pickup_address.select(passenger.work_address.line)
      set_mock_header google_maps: { details: { country_code: 'FR' } }
      new_booking_page.destination_address.select('123 Devis Déménagement, 207 Rue Turenne, 33000 Bordeaux, France')
      new_booking_page.vehicles.wait_until_available
      new_booking_page.vehicles.standard.click
      new_booking_page.vehicles.wait_until_available

      expect(new_booking_page).to have_no_warning
      expect(new_booking_page.journey_type.selected_options).to eql('Work to Work')
      expect(new_booking_page.vehicles.description).to have_total_cost_to_bbc
    end

    scenario 'Excess mileage' do
      passenger = create(:passenger, :bbc_full_pd, :inside_lnemt, allowed_excess_mileage: '100', company: company)

      login_to_app_as(passenger.email)
      wait_until_true { new_booking_page.loaded? }

      set_mock_header google_maps: { distance_matrix: { distance: more_than_policy } }
      new_booking_page.work_to_home_button.click
      new_booking_page.vehicles.wait_until_available
      expect(new_booking_page).to have_no_warning

      set_mock_header google_maps: { distance_matrix: { distance: passenger.allowed_excess_mileage.to_i + more_than_policy } }
      new_booking_page.home_to_work_button.click
      new_booking_page.vehicles.wait_until_available
      expect(new_booking_page).to have_warning(text: 'A salary charge applies for more than PD agreed distance.')
    end
  end
end
