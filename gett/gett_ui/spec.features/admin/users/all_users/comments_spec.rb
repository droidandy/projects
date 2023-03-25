require 'features_helper'

feature 'User Comments', priority: :low do
  let(:users_page)  { Pages::Admin.all_users }
  let(:super_admin) { UITest.super_admin }
  let(:company)     { create(:company, :enterprise) }
  let(:user)        { create(:user, :customer_care) }

  scenario 'Add new and view existed' do
    create(:member_comment, author: super_admin, text: 'Super Passenger', member: company.admin)
    create(:member_comment, author: user, text: 'Take care!', member: company.admin)
    login_as_super_admin
    users_page.load

    user_record = users_page.get_user_by_email(company.admin.email)
    user_record.actions.click
    user_record.wait_until_actions_menu_visible
    expect(user_record.actions_menu.comments_count).to eql(2)
    user_record.actions_menu.comments.click
    users_page.wait_until_comments_modal_visible

    expect(users_page.comments_modal).to have_comments(count: 2)
    expect(users_page.comments_modal.comments.first).to have_author(text: super_admin.full_name)
    expect(users_page.comments_modal.comments.first).to have_message(text: 'Super Passenger')
    expect(users_page.comments_modal.comments.second).to have_author(text: user.full_name)
    expect(users_page.comments_modal.comments.second).to have_message(text: 'Take care!')

    users_page.comments_modal.add_comment('New Comment')
    expect(users_page.comments_modal).to have_comments(count: 3)
    expect(users_page.comments_modal.comments.last).to have_author(text: super_admin.full_name)
    expect(users_page.comments_modal.comments.last).to have_message(text: 'New Comment')
  end
end
