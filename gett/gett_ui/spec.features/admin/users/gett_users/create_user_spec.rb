require 'features_helper'

feature 'Create Gett Users' do
  let(:auth_page)            { Pages::Auth.login }
  let(:gett_users_page)      { Pages::Admin.gett_users }
  let(:new_gett_user_page)   { Pages::Admin.new_gett_user }
  let(:companies_page)       { Pages::Admin.companies }
  let(:ote_new_booking_page) { Pages::Admin.ote_new_booking }
  let(:new_booking_page)     { Pages::App.new_booking }
  let(:bookers_page)         { Pages::App.bookers }
  let!(:company)             { create(:company, :enterprise) }
  let(:fake_user)            { build(:member) }

  include_examples 'create Gett User', 'Superadmin', 'Admin'

  context 'low priority', priority: :low do
    include_examples 'create Gett User', 'Superadmin', 'Booker', true
    include_examples 'create Gett User', 'Superadmin', 'Passenger'
    include_examples 'create Gett User', 'Superadmin', 'Finance'
    include_examples 'create Gett User', 'Superadmin', 'Travel Manager'

    include_examples 'create Gett User', 'Admin', 'Admin', true
    include_examples 'create Gett User', 'Admin', 'Booker'
    include_examples 'create Gett User', 'Admin', 'Passenger'
    include_examples 'create Gett User', 'Admin', 'Finance'
    include_examples 'create Gett User', 'Admin', 'Travel Manager'

    include_examples 'create Gett User', 'Sales', 'Admin', true
    include_examples 'create Gett User', 'Sales', 'Booker'
    include_examples 'create Gett User', 'Sales', 'Passenger'
    include_examples 'create Gett User', 'Sales', 'Finance'
    include_examples 'create Gett User', 'Sales', 'Travel Manager'

    include_examples 'create Gett User', 'Customer Care', 'Admin', true
    include_examples 'create Gett User', 'Customer Care', 'Booker'
    include_examples 'create Gett User', 'Customer Care', 'Passenger'
    include_examples 'create Gett User', 'Customer Care', 'Finance'
    include_examples 'create Gett User', 'Customer Care', 'Travel Manager'

    include_examples 'create Gett User', 'Outsourced Customer Care', 'Admin', true
    include_examples 'create Gett User', 'Outsourced Customer Care', 'Booker'
    include_examples 'create Gett User', 'Outsourced Customer Care', 'Passenger'
    include_examples 'create Gett User', 'Outsourced Customer Care', 'Finance'
    include_examples 'create Gett User', 'Outsourced Customer Care', 'Travel Manager'
  end
end
