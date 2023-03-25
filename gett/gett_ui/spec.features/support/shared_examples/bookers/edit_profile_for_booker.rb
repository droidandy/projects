RSpec.shared_examples "edit profile for booker" do
  it 'can edit profile for another booker' do
    ent_role_labels = {
      'admin'         => 'Admin',
      'finance'       => 'Finance',
      'travelmanager' => 'Travel Manager',
      'booker'        => 'Booker'
    }
    aff_role_labels = {
      'admin'         => 'Admin',
      'booker'        => 'Booker'
    }

    booker = create(:booker, company: company)
    roles = company.enterprise? ? ent_role_labels : aff_role_labels
    new_role = roles.keys.without(booker.role_name).sample
    fake_booker = build(:booker)
    admin_user = user.executive?
    page = edit_booker_page

    if company.enterprise?
      work_roles_list = work_roles.map(&:name)
      departments_list = departments.map(&:name)
    end

    company.enterprise? ? login_to_app_as(user.email) : login_to_affiliate_as(user.email)
    bookers_page.load
    wait_until_true { bookers_page.bookers.present? }
    booker_record = bookers_page.get_booker_by_email(booker.email)
    booker_record.open_details
    booker_record.details.edit_button.click
    wait_until_true { page.loaded? }

    expect(page).to have_reinvite_button
    expect(page.onboarding).not_to be_checked if company.enterprise?

    if admin_user
      expect(page.role.available_options).to match_array(roles.values)
      expect(page.active).to be_checked
    else
      expect(page.role).to be_disabled
      expect(page).to have_email(disabled: true)

      if company.enterprise?
        expect(page.department).to be_disabled
        expect(page.work_role).to be_disabled
      end

      expect(page).not_to have_active
      expect(page).not_to have_change_log_tab
    end

    if company.enterprise?
      available_bookers = (user.admin? || user.travelmanager?) ? [user.full_name, company.admin.full_name, booker.full_name] : [booker.full_name, user.full_name]
      expect(page.passengers.available_options).to match_array(available_bookers)
    end

    page.first_name.set(fake_booker.first_name)
    page.last_name.set(fake_booker.last_name)
    page.phone.set(fake_booker.phone)
    page.passengers.select(company.admin.full_name) if company.enterprise?
    page.attach_image

    if admin_user
      page.email.set(fake_booker.email)
      if company.enterprise?
        page.work_role.select(work_roles_list.first)
        page.department.select(departments_list.first)
      end
      page.role.select(roles[new_role])
    end

    page.submit
    wait_until_true { bookers_page.loaded? }
    user_email = admin_user ? fake_booker.email : booker.email
    booker_record = bookers_page.get_booker_by_email(user_email)
    expect(booker_record.name).to eql(fake_booker.first_name)
    expect(booker_record.surname).to eql(fake_booker.last_name)
    expect(booker_record.phone_number).to eql(fake_booker.phone)
    role = roles[admin_user ? new_role : booker.role_name]
    expect(booker_record.role).to eql(role)

    booker_record.open_details
    booker_record.details.edit_button.click
    wait_until_true { page.loaded? }
    if company.enterprise?
      wait_until_true { page.passengers.selected_options.present? }
      expect(page.passengers.selected_options).to eql([company.admin.full_name])
    end

    if admin_user
      if company.enterprise?
        expect(page.work_role.selected_options).to eql(work_roles_list.first)
        expect(page.department.selected_options).to eql(departments_list.first)
      end

      page.change_log_tab.click
      expect(page).to have_change_logs

      if company.enterprise?
        work_role_log = page.change_log_by_field_name('Work Role')
        expect(work_role_log).to have_author(text: user.full_name)
        expect(work_role_log).to have_from(text: '')
        expect(work_role_log).to have_to(text: work_roles_list.first)
      end

      role_log = page.change_log_by_field_name('Role')
      expect(role_log).to have_author(text: user.full_name)
      expect(role_log).to have_from(text: booker.role_name)
      expect(role_log).to have_to(text: new_role.downcase)

      phone_log = page.change_log_by_field_name('Phone')
      expect(phone_log).to have_author(text: user.full_name)
      expect(phone_log).to have_from(text: booker.phone)
      expect(phone_log).to have_to(text: fake_booker.phone)

      if company.enterprise?
        bookers_log = page.change_log_by_field_name('Passengers')
        expect(bookers_log).to have_author(text: user.full_name)
        expect(bookers_log).to have_from(text: '')
        expect(bookers_log).to have_to(text: company.admin.full_name)
      end

      last_name_log = page.change_log_by_field_name('Last Name')
      expect(last_name_log).to have_author(text: user.full_name)
      expect(last_name_log).to have_from(text: booker.last_name)
      expect(last_name_log).to have_to(text: fake_booker.last_name)

      first_name_log = page.change_log_by_field_name('First Name')
      expect(first_name_log).to have_author(text: user.full_name)
      expect(first_name_log).to have_from(text: booker.first_name)
      expect(first_name_log).to have_to(text: fake_booker.first_name)

      email_log = page.change_log_by_field_name('Email')
      expect(email_log).to have_author(text: user.full_name)
      expect(email_log).to have_from(text: booker.email)
      expect(email_log).to have_to(text: fake_booker.email)

      if company.enterprise?
        department_log = page.change_log_by_field_name('Department')
        expect(department_log).to have_author(text: user.full_name)
        expect(department_log).to have_from(text: '')
        expect(department_log).to have_to(text: departments_list.first)
      end
    end
  end
end
