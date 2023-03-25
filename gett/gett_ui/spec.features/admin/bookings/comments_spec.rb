require 'features_helper'

feature 'Booking Comments' do
  let(:bookings_page) { Pages::Admin.bookings }
  let(:super_admin)   { UITest.super_admin }
  let(:company)       { create(:company, :enterprise) }
  let(:user)          { create(:user, :customer_care) }
  let(:booking)       { wait_for { bookings_page.bookings.first } }

  scenario 'Add new and view existed' do
    order = create(:booking, :without_passenger, booker: company.admin)
    create(:booking_comment, author: super_admin, text: 'VIP Booking', booking: order)
    create(:booking_comment, author: user, text: 'Take care!', booking: order)
    login_as_super_admin
    bookings_page.load(order: order.id)

    expect(booking.details.comments_count).to eql(2)
    booking.details.comments.click
    bookings_page.wait_until_comments_modal_visible

    expect(bookings_page.comments_modal).to have_comments(count: 2)
    expect(bookings_page.comments_modal.comments.first).to have_author(text: super_admin.full_name)
    expect(bookings_page.comments_modal.comments.first).to have_message(text: 'VIP Booking')
    expect(bookings_page.comments_modal.comments.second).to have_author(text: user.full_name)
    expect(bookings_page.comments_modal.comments.second).to have_message(text: 'Take care!')

    bookings_page.comments_modal.add_comment('New Comment')
    expect(bookings_page.comments_modal).to have_comments(count: 3)
    expect(bookings_page.comments_modal.comments.last).to have_author(text: super_admin.full_name)
    expect(bookings_page.comments_modal.comments.last).to have_message(text: 'New Comment')
  end
end
