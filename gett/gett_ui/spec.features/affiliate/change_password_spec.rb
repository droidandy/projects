require 'features_helper'

feature 'Affiliate change Password Page' do
  let(:auth_page)            { Pages::Auth.login }
  let(:new_booking_page)     { Pages::Affiliate.bookings }
  let(:change_password_page) { Pages::Affiliate.change_password }
  let(:company)              { create(:company, :affiliate) }
  let(:app?)                 { false }

  include_examples "change my password"
end
