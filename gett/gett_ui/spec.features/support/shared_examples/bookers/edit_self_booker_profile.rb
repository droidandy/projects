RSpec.shared_examples "edit self booker's profile" do
  it "can edit self booker's profile" do
    fake_booker = build(:booker)
    admin_user = user.executive?
    page = edit_booker_page
    roles = company.enterprise? ? ['Booker', 'Admin', 'Finance', 'Travel Manager'] : %w(Admin Booker)

    if company.enterprise?
      work_roles_list = work_roles.map(&:name)
      departments_list = departments.map(&:name)
    end

    if company.enterprise?
      login_to_app_as(user.email) { bookers_page.load }
    else
      login_to_affiliate_as(user.email) { bookers_page.load }
    end
    wait_until_true { bookers_page.bookers.present? }
    booker_record = bookers_page.get_booker_by_email(user.email)
    booker_record.open_details
    booker_record.details.edit_button.click
    wait_until_true { page.loaded? }

    if user.admin? || user.travelmanager?
      expect(page.role.available_options).to match_array(roles)
    else
      expect(page.role).to be_disabled
    end

    expect(page).to have_no_active
    expect(page).to have_no_reinvite_button
    expect(page.onboarding).not_to be_checked if company.enterprise?
    expect(page).to have_change_log_tab

    unless admin_user
      expect(page).to have_email(disabled: true)
      if company.enterprise?
        expect(page.department).to be_disabled
        expect(page.work_role).to be_disabled
      end
    end

    if company.enterprise?
      available_passenger = user.companyadmin? ? [company.admin.full_name] : [user.full_name, company.admin.full_name]
      expect(page.passengers.available_options).to match_array(available_passenger)

      expect(page.passengers.selected).to be_blank
      page.add_all_passengers.check
      wait_until_true { page.passengers.selected.present? }
      expect(page.passengers.selected).not_to be_blank
      expect(page.passengers.selected.map(&:text)).to match_array(available_passenger)
      expect(page.passengers.selected).to be_all(&:has_no_remove_btn?)

      page.add_all_passengers.uncheck
      expect(page.passengers.selected).not_to be_blank
      expect(page.passengers.selected.map(&:text)).to match_array(available_passenger)
      expect(page.passengers.selected).to be_all(&:has_remove_btn?)

      page.passengers.selected.reverse.each(&:remove)
    end

    page.first_name.set(fake_booker.first_name)
    page.last_name.set(fake_booker.last_name)
    page.phone.set(fake_booker.phone)
    page.passengers.select(company.admin.full_name) if company.enterprise?
    page.attach_image

    if admin_user
      page.email.set(fake_booker.email)
      if company.enterprise?
        page.work_role.select(work_roles_list.last)
        page.department.select(departments_list.last)
      end
    end

    page.submit

    wait_until_true { bookers_page.loaded? }
    user_email = admin_user ? fake_booker.email : user.email
    booker_record = bookers_page.get_booker_by_email(user_email)
    expect(booker_record.name).to eql(fake_booker.first_name)
    expect(booker_record.surname).to eql(fake_booker.last_name)
    expect(booker_record.phone_number).to eql(fake_booker.phone)

    if company.enterprise?
      selected_passenger = user.companyadmin? ? fake_booker : company.admin
      booker_record.open_details
      booker_record.details.edit_button.click
      wait_until_true { page.loaded? }
      wait_until_true { page.passengers.selected_options.present? }
      expect(page.passengers.selected_options).to eql([selected_passenger.full_name])

      if admin_user
        expect(page.work_role.selected_options).to eql(work_roles_list.last)
        expect(page.department.selected_options).to eql(departments_list.last)
      end
    end
  end
end
