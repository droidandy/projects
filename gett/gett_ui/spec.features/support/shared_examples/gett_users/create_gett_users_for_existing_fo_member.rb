RSpec.shared_examples 'create Gett User for existing FrontOffice user' do |role, fo_role|
  it "with role #{role} and FrontOffice role #{fo_role}" do
    password = 'P@ssword'
    existed_user = create(fo_role.downcase.delete(' ').to_sym, company: company)
    login_as_super_admin
    page = new_gett_user_page
    page.load

    page.role.select role
    page.first_name.set fake_user.first_name
    page.last_name.set fake_user.last_name
    page.email.set existed_user.email
    page.verify_button.click
    expect(page).to have_text('Front office user already exists with such email')

    expect(page.first_name(disabled: true)).to have_attributes(value: existed_user.first_name)
    expect(page.last_name(disabled: true)).to have_attributes(value: existed_user.last_name)

    expect(page.create_user_for_front_office).to be_disabled
    expect(page.create_user_for_front_office).to be_checked

    expect(page.company).to be_disabled
    expect(page.company).to have_text(company.name)

    expect(page.front_role).to be_disabled
    expect(page.front_role).to have_text(fo_role.downcase.delete(' ').capitalize)
    expect(page.phone.stripped_value).to eql(existed_user.phone)
    page.submit

    wait_until_true { gett_users_page.loaded? }
    created_user = gett_users_page.get_user_by_email(existed_user.email)
    expect(created_user).to have_user_role(text: role)
    gett_users_page.logout

    auth_page.login_to_admin_as(existed_user.email, password, true)
    landing_page = (role == 'Outsourced Customer Care') ? ote_new_booking_page : companies_page
    wait_until_true { landing_page.loaded? }
    landing_page.logout

    auth_page.login_to_app_as(existed_user.email, password, true)
    wait_until_true { new_booking_page.loaded? }
    if fo_role == 'Passenger'
      expect(new_booking_page.sidebar).to have_no_bookers
    else
      bookers_page.load
      member = bookers_page.get_booker_by_email(existed_user.email)
      expect(member.role).to eql(fo_role)
    end
  end
end
