RSpec.shared_examples "edit profile for member" do
  it 'can edit profile for member' do
    role_labels = {
      'admin'         => 'Admin',
      'finance'       => 'Finance',
      'travelmanager' => 'Travel Manager',
      'booker'        => 'Booker',
      'passenger'     => 'Passenger'
    }
    if company.enterprise?
      departmets_list = create_list(:department, 2, company: company).map(&:name)
      work_roles_list = create_list(:work_role, 2, company: company).map(&:name)
      bookers = create_list(:booker, 2, company: company).map(&:full_name)
      passengers = create_list(:passenger, 2, company: company).map(&:full_name)
      new_addresses = ['312 Vauxhall Bridge Rd', 'Acton Town Station, Gunnersbury']
    end
    fake_member = build(:member)
    page = edit_user_page

    login_as_super_admin
    users_page.load
    user_record = users_page.get_user_by_email(member.email)
    user_record.actions.click
    user_record.wait_until_actions_menu_visible
    user_record.actions_menu.edit.click
    wait_until_true { page.loaded? }

    expect(page).to have_reinvite_button
    expect(page.active).to be_checked
    if company.enterprise?
      expect(page.onboarding).not_to be_checked
      expect(page.vip).not_to be_checked
      expect(page.role.available_options).to match_array(role_labels.values)
    else
      expect(page.role.available_options).to match_array(%w(Admin Booker))
    end

    if company.enterprise?
      if member.booker?
        expect(page.bookers.available_options).to match_array(bookers + [company.admin.full_name, member.full_name])
        expect(page.passengers.available_options).to match_array(passengers + bookers + [company.admin.full_name, member.full_name])
      else
        expect(page).to have_no_passengers
        expect(page.bookers.available_options).to match_array(bookers + [company.admin.full_name])
      end
    end

    # validate required fields
    page.first_name.clear
    page.last_name.clear
    page.phone.clear
    page.email.clear
    page.submit
    expect(page.first_name.error_message).to eql("Please add in the passengers first name")
    expect(page.last_name.error_message).to eql("Please add in the passengers last name")
    expect(page.phone.error_message).to eql("Please add in the passengers phone number")
    expect(page.email.error_message).to eql("Please add in the passengers email")

    # validate required fields doesn't allow symbols
    page.first_name.set('S{ome^nam[e')
    page.last_name.set('So}me]Last/Name')
    page.submit
    expect(page.first_name.error_message).to eql('Invalid name. Avoid using special symbols')
    expect(page.last_name.error_message).to eql('Invalid name. Avoid using special symbols')

    page.first_name.set('Some%name')
    page.last_name.set('SomeLast|Name')
    page.submit
    expect(page.first_name.error_message).to eql('Invalid name. Avoid using special symbols')
    expect(page.last_name.error_message).to eql('Invalid name. Avoid using special symbols')

    page.role.select('Admin')
    page.first_name.set(fake_member.first_name)
    page.last_name.set(fake_member.last_name)

    page.phone.set(fake_member.phone)
    page.attach_image
    page.email.set(fake_member.email)

    if company.enterprise?
      page.work_role.select(work_roles_list.first)
      page.department.select(departmets_list.first)

      with_headers do
        set_address_headers new_addresses.first
        page.home_address.select(new_addresses.first)
        set_address_headers new_addresses.last
        page.work_address.select(new_addresses.last)
      end

      page.passengers.select(passengers.last)
      page.bookers.select(bookers.first)

      page.vip.click
      page.payroll_id.set('new_payroll_id')
      page.cost_centre.set('new_cost_centre')
      page.division.set('new_division')
    end

    page.submit
    wait_until_true { users_page.loaded? }
    member_record = users_page.get_user_by_email(fake_member.email)
    expect(member_record.name).to eql(fake_member.first_name)
    expect(member_record.surname).to eql(fake_member.last_name)
    expect(member_record.role).to eql('Admin')
    expect(member_record).to have_user_vip(text: 'VIP') if company.enterprise?

    member_record.open_details
    expect(member_record.details).to have_avatar
    member_record.details.edit_button.click
    wait_until_true { page.loaded? }

    expect(page.phone.value.delete(' ')).to eql(fake_member.phone.delete(' '))

    if company.enterprise?
      expect(page.home_address.selected_options).to include(new_addresses.first)
      expect(page.work_address.selected_options).to include(new_addresses.last)
      expect(page.bookers.selected_options).to eql([bookers.first])
      expect(page.passengers.selected_options).to eql([passengers.last])

      expect(page.payroll_id.value).to eql('new_payroll_id')
      expect(page.cost_centre.value).to eql('new_cost_centre')
      expect(page.division.value).to eql('new_division')

      expect(page.work_role.selected_options).to eql(work_roles_list.first)
      expect(page.department.selected_options).to eql(departmets_list.first)
    end
  end
end
