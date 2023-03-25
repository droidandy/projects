require 'features_helper'

feature 'Change Password Page' do
  let(:auth_page)            { Pages::Auth.login }
  let(:new_booking_page)     { Pages::App.new_booking }
  let(:change_password_page) { Pages::App.change_password }
  let(:company)              { create(:company, :enterprise) }
  let(:app?)                 { true }

  include_examples "change my password"
end
