require 'features_helper'

feature 'Create User for existed FrontOffice user' do
  let(:auth_page)            { Pages::Auth.login }
  let(:gett_users_page)      { Pages::Admin.gett_users }
  let(:new_gett_user_page)   { Pages::Admin.new_gett_user }
  let(:companies_page)       { Pages::Admin.companies }
  let(:ote_new_booking_page) { Pages::Admin.ote_new_booking }
  let(:new_booking_page)     { Pages::App.new_booking }
  let(:bookers_page)         { Pages::App.bookers }
  let!(:company)             { create(:company, :enterprise) }
  let(:fake_user)            { build(:member) }

  include_examples 'create Gett User for existing FrontOffice user', 'Superadmin', 'Admin'

  context 'low priority', priority: :low do
    include_examples 'create Gett User for existing FrontOffice user', 'Superadmin', 'Booker'
    include_examples 'create Gett User for existing FrontOffice user', 'Superadmin', 'Passenger'
    include_examples 'create Gett User for existing FrontOffice user', 'Superadmin', 'Finance'
    include_examples 'create Gett User for existing FrontOffice user', 'Superadmin', 'Travel Manager'

    include_examples 'create Gett User for existing FrontOffice user', 'Admin', 'Admin'
    include_examples 'create Gett User for existing FrontOffice user', 'Admin', 'Booker'
    include_examples 'create Gett User for existing FrontOffice user', 'Admin', 'Passenger'
    include_examples 'create Gett User for existing FrontOffice user', 'Admin', 'Finance'
    include_examples 'create Gett User for existing FrontOffice user', 'Admin', 'Travel Manager'

    include_examples 'create Gett User for existing FrontOffice user', 'Sales', 'Admin'
    include_examples 'create Gett User for existing FrontOffice user', 'Sales', 'Booker'
    include_examples 'create Gett User for existing FrontOffice user', 'Sales', 'Passenger'
    include_examples 'create Gett User for existing FrontOffice user', 'Sales', 'Finance'
    include_examples 'create Gett User for existing FrontOffice user', 'Sales', 'Travel Manager'

    include_examples 'create Gett User for existing FrontOffice user', 'Customer Care', 'Admin'
    include_examples 'create Gett User for existing FrontOffice user', 'Customer Care', 'Booker'
    include_examples 'create Gett User for existing FrontOffice user', 'Customer Care', 'Passenger'
    include_examples 'create Gett User for existing FrontOffice user', 'Customer Care', 'Finance'
    include_examples 'create Gett User for existing FrontOffice user', 'Customer Care', 'Travel Manager'

    include_examples 'create Gett User for existing FrontOffice user', 'Outsourced Customer Care', 'Admin'
    include_examples 'create Gett User for existing FrontOffice user', 'Outsourced Customer Care', 'Booker'
    include_examples 'create Gett User for existing FrontOffice user', 'Outsourced Customer Care', 'Passenger'
    include_examples 'create Gett User for existing FrontOffice user', 'Outsourced Customer Care', 'Finance'
    include_examples 'create Gett User for existing FrontOffice user', 'Outsourced Customer Care', 'Travel Manager'
  end
end
