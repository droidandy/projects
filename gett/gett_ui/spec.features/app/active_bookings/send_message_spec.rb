require 'features_helper'
using Sequel::CoreRefinements

feature 'Active Bookings - Send Message' do
  let(:bookings_page)     { Pages::Admin.bookings }
  let(:company)           { create(:company, :enterprise) }
  let(:passenger)         { create(:passenger, :with_home_address, company: company) }
  let(:order)             { wait_for { bookings_page.bookings.first } }
  let(:long_sms)          { '0' * 800 }

  before do
    create(:booking, :order_received, :scheduled, international: true, passenger: passenger, booker: company.admin)
  end

  def find_sms(sms_to)
    wait_until_true(timeout: 40) do
      Request.where(service_provider: 'nexmo', :request_payload.pg_jsonb.get_text('to') => sms_to).all
    end
  end

  scenario 'International Order' do
    login_as_super_admin

    bookings_page.load
    expect(bookings_page).to have_bookings(count: 1)
    order.open_details
    order.details.message.click
    wait_until_true { bookings_page.has_send_message_modal? }

    bookings_page.send_message_modal.phones.set 'Booker'
    bookings_page.send_message_modal.text.set long_sms + 'something'
    expect(bookings_page.send_message_modal.text.text).to eql(long_sms)

    bookings_page.send_message_modal.text.set 'Hey-o! Taxi arrived, cowboy!'
    phones = bookings_page.send_message_modal.phones.selected_options.map { |o| o.split('-').last.strip }
    bookings_page.send_message_modal.send_button.click
    wait_until_true { bookings_page.has_no_send_message_modal? }
    phones.each do |phone|
      requests = find_sms(phone)
      expect(requests.size).to eql(1)
      expect(requests.first.request_payload['text']).to eql('Hey-o! Taxi arrived, cowboy!')
    end
  end
end
