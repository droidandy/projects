require 'features_helper'

feature 'Service feedback' do
  let(:bookings_page) { Pages::App.bookings }
  let(:company)       { create(:company, :enterprise) }
  let(:passenger)     { create(:passenger, :with_home_address, company: company) }
  let(:order)         { wait_for { bookings_page.bookings.first } }
  let(:long_msg)      { '0' * 450 }
  let(:feedbacks)     { Feedback.where(booking_id: booking.id).all }
  let(:feedback)      { feedbacks.first }
  let!(:booking) do
    create(:booking, :order_received, :scheduled, international: true, passenger: passenger, booker: company.admin)
  end

  scenario 'should allow to be posted' do
    login_to_app_as company.admin.email

    bookings_page.load
    expect(bookings_page).to have_bookings(count: 1)
    order.open_details
    order.details.service_feedback.click
    wait_until_true { bookings_page.has_service_feedback_modal? }

    bookings_page.service_feedback_modal.message.set long_msg + 'something'
    expect(bookings_page.service_feedback_modal.message.text).to eql(long_msg)

    bookings_page.service_feedback_modal.pick_rating(5)
    expect(bookings_page.service_feedback_modal.selected_rating.text).to eql('5')
    bookings_page.service_feedback_modal.pick_rating(10)
    expect(bookings_page.service_feedback_modal.selected_rating.text).to eql('10')

    expect(bookings_page.service_feedback_modal).to have_cancel_button
    expect(bookings_page.service_feedback_modal).to have_save_button
    bookings_page.service_feedback_modal.save_button.click
    expect(bookings_page).to have_no_service_feedback_modal

    expect(feedbacks.size).to   eql(1)
    expect(feedback.message).to eql(long_msg)
    expect(feedback.rating).to  eql(10)
    expect(feedback.user_id).to eql(company.admin.id)
  end
end
