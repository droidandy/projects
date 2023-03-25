RSpec.shared_examples 'Account Details Page permission for' do |role|
  it "member with role #{role.capitalize} #{[:companyadmin, :admin, :travelmanager].include?(role) ? 'should' : 'should not'} be able to edit page" do
    member =
      if role == :companyadmin
        company.admin
      elsif company.bbc?
        create(role, :bbc_full_pd, company: company)
      else
        create(role, company: company)
      end

    company.affiliate? ? login_to_affiliate_as(member.email) : login_to_app_as(member.email)
    wait_until_true { new_booking_page.loaded? }
    account_details_page.load

    expect(account_details_page).to have_primary_contact
    expect(account_details_page).to have_billing_contact

    if [:companyadmin, :admin, :travelmanager].include?(role)
      expect(account_details_page).to have_edit_button
      expect(account_details_page).to have_edit_logo_button
      if company.exactly_enterprise?
        expect(account_details_page).to have_sftp_settings
        expect(account_details_page).to have_hr_feed_paths
        expect(account_details_page).to have_reference_paths
        expect(account_details_page).to have_synchronize_button
      end
    else
      expect(account_details_page).to have_no_edit_button
      expect(account_details_page).to have_no_edit_logo_button
      if company.enterprise?
        expect(account_details_page).to have_no_sftp_settings
        expect(account_details_page).to have_no_hr_feed_paths
        expect(account_details_page).to have_no_reference_paths
        expect(account_details_page).to have_no_synchronize_button
      end
    end
  end
end
