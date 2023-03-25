require 'features_helper'
require 'shared_examples/notification_examples'

feature 'Notifications', priority: :low do
  let(:user) do
    create(:passenger, :with_home_address, :with_payment_cards, company: company, notify_with_push: false)
  end
  let(:new_booking_page)     { Pages::App.new_booking }
  let(:bookings_page)        { Pages::App.bookings }
  let(:company)              { create(:company, :enterprise, booker_notifications: true) }
  let(:company_booker)       { create(:booker, company: company, passenger_pks: [user.id]) }
  let(:order_id)             { Booking.where(passenger_id: user.id).first.service_id }
  let(:future_time)          { nil }
  let(:state)                { nil }
  let(:booker)               { nil }
  let(:recipient)            { user }
  let(:iphone)               { nil }
  let(:android)              { nil }
  # let(:iphone)        { 'https://itunes.apple.com/gb/app/one-transport/id1352979619' }
  # let(:android)       { 'https://play.google.com/store/apps/details?id=com.onetransport.enterprise' }
  let(:booking)              { Booking.last }
  let(:scheduled_time)       { Time.current + 2.hours }
  let(:short_link)           { ShortUrl.generate("/bookings/#{booking.id}/summary") }
  let(:scheduled_time_in_tz) { format_time(scheduled_time.in_time_zone(booking.timezone)) }
  let(:ot_company)           { 'Gett Business Solutions powered by One Transport' }
  let(:phv_license)          { 'PHV License: 03432225555' }
  let(:update_message)       { booker ? "Here is an update on the order you booked for #{user.first_name} #{user.last_name}. " : '' }
  let(:questions)            { "Track your order in Gett Business Solutions app Kind regards! Your #{ot_company}" }
  let(:vat_no)               { 'VAT Reg No 810311885' }
  let(:expected_body)        { "#{update_message}#{base_body}" }

  def format_time(time)
    time.strftime('%d/%m/%Y %H:%M')
  end

  def find_emails_for_recipient(email)
    Dir["tmp/letter_opener/#{email}*/rich.html"]
  end

  before do
    if state.present?
      set_mock_header(
        gett_api: { ride_details: { template: state } },
        one_transport: { vehicle_location: { template: state } }
      )
    end

    params = { passenger: user, booker: booker || user }
    if future_time
      params[:scheduled_at] = scheduled_time
      params[:asap] = false
    end
    create(:booking, :personal_card, :creating, params)

    CreateBookingRequestWorker.new.perform(booking.id)

    wait_until_true do
      booking.reload.status == 'order_received'
    end

    unless state == 'order_received'
      booking.status = 'locating'
      booking.scheduled_at = future_time if future_time
      time = 1.hour.ago
      booking.booked_at = booking.started_locating_at = time
      booking.save(validate: false)
      booking.reload
      if future_time
        expect(format_time(booking.scheduled_at)).to eq format_time(future_time)
      end
      expect(format_time(booking.booked_at)).to eq format_time(time)
      expect(format_time(booking.started_locating_at)).to eq format_time(time)

      BookingsUpdater.new.perform

      if state.present?
        wait_until_true(timeout: 120) do
          booking.reload.status == state
        end
      end
    end
  end

  context "order received email" do
    let(:base_body) { "We've received your order Hi #{user.first_name} #{user.last_name}, Great News! Your #{ot_company} Order #{order_id} has been confirmed. We'll send you confirmation of your order once your driver has been allocated. If you have any queries, please contact your account administrator Call Us 0203 608 9312 Thank you! Your #{ot_company}" }
    let(:subject)   { "We’ve received your #{order_id} order" }
    let(:sms_title) { "We've received your #{ot_company} order" }
    let(:sms_text)  { "We've received your #{ot_company} order #{order_id}. We'll send you confirmation of your order once your driver has been allocated. Click #{short_link} to see more info about booking. If you have any queries about the order, please contact us on +44203 608 9312." }
    [:user, :booker].each do |u|
      context "for #{u}" do
        if u == :booker
          let(:booker)        { company_booker }
          let(:recipient)     { booker }
        else
          include_examples 'validate sms'
        end
        include_examples 'validate email'

        context 'future booking' do
          let(:future_time) { 45.minutes.from_now }
          let(:sms_title)   { "Great news! Your #{ot_company} order has been confirmed" }
          let(:sms_text)    { "Great news! Your #{ot_company} order has been confirmed. A taxi will arrive at 167 Fleet St, London EC4A 2EA, UK on #{scheduled_time_in_tz} to take you to 221B Baker St, Marylebone, London NW1 6XE, UK.. If you have any queries about the order, please contact us on 0345 155 0802." }
          let(:base_body)   { "We've received your order Hi #{user.first_name} #{user.last_name}, Great News! Your #{ot_company} Order #{order_id} has been confirmed. A taxi will arrive at 167 Fleet St, London EC4A 2EA, UK on #{scheduled_time_in_tz} to take you to 221B Baker St, Marylebone, London NW1 6XE, UK.. If you have any queries, please contact your account administrator Call Us 0203 608 9312 Thank you! Your #{ot_company}" }

          if u == :user
            include_examples 'validate sms'
          end

          include_examples 'validate email'
        end
      end
    end
  end

  context "vehicle on the way email" do
    let(:subject)       { "Your driver is on the way for #{order_id}" }
    let(:base_body)     { "Your driver is on the way Hi #{user.first_name} #{user.last_name}, Your driver for order #{order_id} will arrive at 167 Fleet St, London EC4A 2EA, UK in 27 minutes. Driver name: John Johnson Driver phone: +1(312)111-1111 Number plate: Q661182 #{phv_license} Please click here to see more information about this booking. Thank you! Your #{ot_company}" }
    let(:state)         { 'on_the_way' }
    let(:sms_title)     { "Your driver for order #{order_id} will arrive" }
    let(:sms_text)      { "Your driver for order #{order_id} will arrive at 167 Fleet St, London EC4A 2EA, UK in 27 minutes. Driver name: John Johnson Driver phone: +1(312)111-1111 Number plate: Q661182 #{phv_license} Click #{short_link} to see more info about booking." }

    [:user, :booker].each do |u|
      context "for #{u}" do
        if u == :booker
          let(:booker)        { company_booker }
          let(:recipient)     { booker }
          # let(:iphone)        { 'https://itunes.apple.com/gb/app/one-transport/id1352979619' }
          # let(:android)       { 'https://play.google.com/store/apps/details?id=com.onetransport.enterprise' }
        else
          include_examples 'validate sms'
        end
        include_examples 'validate email'

        context 'future booking' do
          let(:future_time) { 45.minutes.from_now }
          let(:sms_title)   { "Your driver for order #{order_id} will arrive" }
          let(:sms_text)    { "Your driver for order #{order_id} will arrive at 167 Fleet St, London EC4A 2EA, UK in about 1 hour. Driver name: John Johnson Driver phone: +1(312)111-1111 Number plate: Q661182 #{phv_license} Click #{short_link} to see more info about booking." }
          let(:base_body)   { "Your driver is on the way Hi #{user.first_name} #{user.last_name}, Your driver for order #{order_id} will arrive at 167 Fleet St, London EC4A 2EA, UK in about 1 hour. Driver name: John Johnson Driver phone: +1(312)111-1111 Number plate: Q661182 #{phv_license} Please click here to see more information about this booking. Thank you! Your #{ot_company}" }
          if u == :user
            include_examples 'validate sms'
          end

          include_examples 'validate email'
        end
      end
    end
  end

  context "vehicle arrived email" do
    let(:subject)   { "Your driver is here for #{order_id}" }
    let(:base_body) { "Your driver is here 167 Fleet St, London EC4A 2EA, UK Order ID: #{order_id} Driver name: John Johnson Driver phone: +1(312)111-1111 Number plate: Q661182 #{phv_license} Thank you for using #{ot_company}! We hope you have a safe journey. Please click here to see more information about this booking. Thank you! Your #{ot_company}" }
    let(:state)     { 'arrived' }
    let(:sms_title) { "Your driver is here" }
    let(:sms_text)  { "Your driver is here! 167 Fleet St, London EC4A 2EA, UK Order ID: #{order_id} Driver name: John Johnson Driver phone: +1(312)111-1111 Number plate: Q661182 #{phv_license} Thank you for using #{ot_company}! We hope you have a safe journey. Click #{short_link} to see more info about booking." }

    [:user, :booker].each do |u|
      context "for #{u}" do
        if u == :booker
          let(:booker)        { company_booker }
          let(:recipient)     { booker }
        else
          include_examples 'validate sms'
        end
        include_examples 'validate email'

        context 'future booking' do
          let(:future_time) { 45.minutes.from_now }
          if u == :user
            include_examples 'validate sms'
          end
          include_examples 'validate email'
        end
      end
    end
  end

  context 'order canceled email' do
    before do
      login_to_app_as user.email
      bookings_page.load
      wait_until_true { !bookings_page.bookings.empty? }
      bookings_page.bookings.first.cancel
      wait_until_true { booking.reload.status == 'cancelled' }
    end
    let(:scheduled_time_in_tz) { format_time(booking.scheduled_at.in_time_zone(booking.timezone)) }
    let(:subject)              { "Your cancellation for order #{order_id}" }
    let(:base_body)            { "Order #{order_id} has been cancelled Hi #{user.first_name} #{user.last_name}, Your order #{order_id} for a taxi to 221B Baker St, Marylebone, London NW1 6XE, UK on #{scheduled_time_in_tz} has been successfully cancelled. Please click here to see more information about this booking. If you have any questions — just let us know Call Us 0203 608 9312 Write us contact.uk@gett.com Thank you! Your #{ot_company}" }

    include_examples 'validate email'
  end

  context 'receipt email' do
    let(:state) { 'completed' }
    let(:total) { format_money(booking.successful_payment&.amount_cents) }
    let(:fare)  { format_money(booking.charges&.fare_cost) }
    let(:vat)   { format_money(booking.charges&.vat) }
    let(:fee)   { format_money(booking.charges&.all_fees.to_i - booking.charges&.tips.to_i) }
    let(:tips)  { format_money(booking.charges&.tips) }
    let(:car)   { 'BlackTaxi' }

    include ActionView::Helpers::NumberHelper
    def format_money(amt)
      number_to_currency(amt.to_f / 100, unit: '£ ')
    end

    before do
      BookingsChargesUpdater.new.perform(booking.id)
      payment = wait_until_true(timeout: 60) { Payment.first }
      payment.payments_os_id = '123'
      payment.save
      # trigger status update
      `curl -X POST http://localhost:3000/incomings/payment?id=#{payment.payments_os_id} &> /dev/null`
    end

    let(:subject)   { "Your receipt for #{order_id} order" }
    let(:base_body) { "Hello #{user.first_name}, Thanks for using #{ot_company}! #{total} Personal **** #{booking.payment_card&.last_4} Order ID: ##{order_id} Pick Up #{booking.started_at.strftime('%H:%M, %d %B %Y')} 167 Fleet St, London EC4A 2EA, UK Drop Off #{booking.ended_at.strftime('%H:%M, %d %B %Y')} 221B Baker St, Marylebone, London NW1 6XE, UK Transaction Information Fare #{fare} Fee #{fee} VAT (20%) #{vat} Tips #{tips} Charged to **** #{booking.payment_card&.last_4} Total #{total} #{vat_no} Driver Information Name John Johnson Miles 10.0 miles Waiting time 00:00:00 Trip Time 00:00:00 Car Type #{car}" }
    include_examples 'validate email'
  end
end
