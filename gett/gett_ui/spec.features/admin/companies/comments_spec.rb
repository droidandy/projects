require 'features_helper'

feature 'Company Comments' do
  let(:companies_page) { Pages::Admin.companies }
  let(:super_admin)    { UITest.super_admin }
  let!(:company)       { create(:company, :enterprise) }
  let(:user)           { create(:user, :customer_care) }

  scenario 'Add new and view existed' do
    create(:company_comment, author: super_admin, text: 'They owe us money', company: company)
    create(:company_comment, author: user, text: 'Take care!', company: company)
    login_as_super_admin
    companies_page.load
    wait_until_true { companies_page.companies.present? }

    record = companies_page.companies.first
    record.open_details
    expect(record.details.comments_count).to eql(2)
    record.details.comments_button.click
    companies_page.wait_until_comments_modal_visible

    expect(companies_page.comments_modal).to have_comments(count: 2)
    expect(companies_page.comments_modal.comments.first).to have_author(text: super_admin.full_name)
    expect(companies_page.comments_modal.comments.first).to have_message(text: 'They owe us money')
    expect(companies_page.comments_modal.comments.second).to have_author(text: user.full_name)
    expect(companies_page.comments_modal.comments.second).to have_message(text: 'Take care!')

    companies_page.comments_modal.add_comment('New Comment')
    expect(companies_page.comments_modal).to have_comments(count: 3)
    expect(companies_page.comments_modal.comments.last).to have_author(text: super_admin.full_name)
    expect(companies_page.comments_modal.comments.last).to have_message(text: 'New Comment')
  end
end
