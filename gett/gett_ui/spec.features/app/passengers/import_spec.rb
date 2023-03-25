require 'features_helper'

feature 'Passengers Import' do
  let(:auth_page)             { Pages::Auth.login }
  let(:passengers_page)       { Pages::App.passengers }
  let(:edit_passenger_page)   { Pages::App.edit_passenger }
  let(:activate_account_page) { Pages::Auth.set_password }
  let(:company)               { create(:company, :enterprise) }
  let(:department)            { create(:department, name: 'dept1', company: company) }
  let(:work_role)             { create(:work_role, name: 'wr1', company: company) }

  feature 'as a member with role Company Admin can' do
    let(:user) { company.admin }
    include_examples 'import passengers'
  end

  feature 'as a member with role Admin can', priority: :low do
    let(:user) { create(:admin, company: company) }
    include_examples 'import passengers'
  end
end
