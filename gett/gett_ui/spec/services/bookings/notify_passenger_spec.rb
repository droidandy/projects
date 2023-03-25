require 'rails_helper'

RSpec.describe Bookings::NotifyPassenger, type: :service do
  let(:service) { Bookings::NotifyPassenger.new(booking: booking, only: only, force: force) }
  let(:only)    { nil }
  let(:force)   { nil }

  describe '#execute' do
    let(:booking)                      { create(:booking) }
    let(:enterprise?)                  { true }
    let(:notify_passenger_with_sms?)   { true }
    let(:notify_passenger_with_email?) { true }
    let(:notify_passenger_with_push?)  { true }
    let(:booker_notifications?)        { true }

    before do
      allow(service).to receive(:enterprise?).and_return(enterprise?)
      allow(service).to receive(:notify_passenger_with_sms?).and_return(notify_passenger_with_sms?)
      allow(service).to receive(:notify_passenger_with_email?).and_return(notify_passenger_with_email?)
      allow(service).to receive(:notify_passenger_with_push?).and_return(notify_passenger_with_push?)
      allow(service).to receive(:booker_notifications?).and_return(booker_notifications?)
    end

    it { expect(service.execute).to be_success }

    it 'does not notify passenger with SMS' do
      expect(SmsSender).to receive(:perform_at).and_call_original
      service.execute
    end

    it 'notifies passenger with email' do
      expect(service).to receive(:notify_passenger_with_email).and_call_original
      service.execute
    end

    it 'notifies passenger with push' do
      expect(service).to receive(:notify_passenger_with_push).and_call_original
      service.execute
    end

    it 'notifies bookers with email' do
      expect(service).to receive(:notify_bookers_with_email).and_call_original
      service.execute
    end

    context 'when only sms should be sent' do
      let(:only)  { :sms }
      let(:force) { true }

      let(:notify_passenger_with_email?) { false }
      let(:notify_passenger_with_push?)  { false }
      let(:booker_notifications?)        { false }

      it 'notifies passenger with SMS' do
        expect(SmsSender).to receive(:perform_at).and_call_original
        service.execute
      end

      it 'does not notify passenger with email' do
        expect(service).not_to receive(:notify_passenger_with_email)
        service.execute
      end

      it 'does not notify passenger with push' do
        expect(service).not_to receive(:notify_passenger_with_push)
        service.execute
      end

      it 'does not notify bookers with email' do
        expect(service).not_to receive(:notify_bookers_with_email)
        service.execute
      end
    end

    context 'service.enterprise? is false' do
      let(:enterprise?) { false }

      it 'does not notify passenger with SMS' do
        expect(SmsSender).not_to receive(:perform_at)
        service.execute
      end

      it 'does not notify passenger with email' do
        expect(service).not_to receive(:notify_passenger_with_email)
        service.execute
      end

      it 'does not notify bookers with email' do
        expect(service).not_to receive(:notify_bookers_with_email)
        service.execute
      end
    end

    context 'service.notify_passenger_with_sms? is false' do
      let(:notify_passenger_with_sms?) { false }

      it 'does not notify passenger with SMS' do
        expect(SmsSender).not_to receive(:perform_at)
        service.execute
      end

      it 'notifies passenger with email' do
        expect(service).to receive(:notify_passenger_with_email).and_call_original
        service.execute
      end

      it 'notifies bookers with email' do
        expect(service).to receive(:notify_bookers_with_email).and_call_original
        service.execute
      end
    end

    context 'service.notify_passenger_with_email? is false' do
      let(:notify_passenger_with_email?) { false }

      it 'notifies passenger with SMS' do
        expect(SmsSender).to receive(:perform_at).and_call_original
        service.execute
      end

      it 'does not notify passenger with email' do
        expect(service).not_to receive(:notify_passenger_with_email)
        service.execute
      end

      it 'notifies bookers with email' do
        expect(service).to receive(:notify_bookers_with_email).and_call_original
        service.execute
      end
    end

    context 'service.booker_notifications? is false' do
      let(:booker_notifications?) { false }

      it 'notifies passenger with SMS' do
        expect(SmsSender).to receive(:perform_at).and_call_original
        service.execute
      end

      it 'notifies passenger with email' do
        expect(service).to receive(:notify_passenger_with_email).and_call_original
        service.execute
      end

      it 'does not notify bookers with email' do
        expect(service).not_to receive(:notify_bookers_with_email)
        service.execute
      end
    end

    describe '#notify_bookers_with_email' do
      before { allow(service).to receive(:notify_booker_with_email?).and_return(notify_booker_with_email?) }

      context 'notify_booker_with_email for booking.booker is true' do
        let(:notify_booker_with_email?) { true }

        it 'notifies booking booker with email' do
          expect(service).to receive(:notify_booking_booker_with_email).and_call_original
          service.execute
        end

        it 'notifies company bookers with email' do
          expect(service).to receive(:notify_company_bookers_with_email).and_call_original
          service.execute
        end
      end

      context 'notify_booker_with_email for booking.booker is false' do
        let(:notify_booker_with_email?) { false }

        it 'notifies booking booker with email' do
          expect(service).not_to receive(:notify_booking_booker_with_email)
          service.execute
        end

        it 'notifies company bookers with email' do
          expect(service).to receive(:notify_company_bookers_with_email).and_call_original
          service.execute
        end
      end
    end

    describe '#notify_company_bookers_with_email' do
      let(:company)        { create(:company) }
      let(:booking_booker) { create(:booker, company: company) }
      let(:booking)        { create(:booking, booker: booking_booker, company: company) }
      let(:company_booker) { create(:booker, company: company) }

      let(:booking_booker_email)              { booking_booker.email }
      let(:existing_company_booker_email)     { company_booker.email }
      let(:non_existing_company_booker_email) { 'some@email.com' }
      let(:booker_notifications_emails) do
        "#{booking_booker_email}, #{existing_company_booker_email}, #{non_existing_company_booker_email}"
      end

      before do
        allow(service).to receive(:notify_booker_with_email?).and_return(true)
        allow(service).to receive(:booker_notifications_emails).and_return(booker_notifications_emails)
        allow(NotificationMailer).to receive(:notify_passenger).and_return(double.as_null_object)
        allow(NotificationMailer).to receive(:notify_booking_booker).and_return(double.as_null_object)
        allow(NotificationMailer).to receive(:notify_company_booker).and_return(double.as_null_object)
      end

      it 'does not notify booking_booker as company booker' do
        expect(NotificationMailer).not_to receive(:notify_company_booker)
          .with(booking.id, booking_booker_email, instance_of(String))
        service.execute
      end

      it 'notifies existing and non existing company booker with email' do
        expect(NotificationMailer).to receive(:notify_company_booker)
          .with(booking, existing_company_booker_email, instance_of(String))
          .once
        expect(NotificationMailer).to receive(:notify_company_booker)
          .with(booking, non_existing_company_booker_email, instance_of(String))
          .once
        service.execute
      end
    end

    describe 'message content' do
      let!(:driver) { create(:booking_driver, booking: booking, vehicle: {license_plate: '123 456'}, name: 'John', phone_number: '07476092612') }
      let!(:existing_company_booker) { create(:booker, company: booking.company) }
      let(:existing_company_booker_email) { existing_company_booker.email }
      let(:non_existing_company_booker_email) { 'some@email.com' }
      let(:booker_notifications_emails) do
        "#{existing_company_booker_email}, #{non_existing_company_booker_email}"
      end

      before do
        allow(SmsSender).to receive(:perform_at).and_return(double.as_null_object)
        allow(NotificationMailer).to receive(:notify_passenger).and_return(double.as_null_object)
        allow(NotificationMailer).to receive(:notify_booking_booker).and_return(double.as_null_object)
        allow(NotificationMailer).to receive(:notify_company_booker).and_return(double.as_null_object)
        allow(service).to receive(:notify_booker_with_email?).and_return(true)
        allow(service).to receive(:booker_notifications_emails).and_return(booker_notifications_emails)
        service.execute
      end

      context 'when order is in arrived status' do
        let(:booking) { create(:booking, status: 'arrived') }
        let(:phone)   { booking.passenger.phone }
        let(:time_at) { DateTime.current }

        before { allow(service).to receive(:deliver_at).and_return(time_at) }

        it 'sends message containing driver name' do
          expect(SmsSender).to have_received(:perform_at).with(time_at, phone, a_string_including('John'))
          expect(NotificationMailer).to have_received(:notify_passenger).with(booking, a_string_including('John'))
          expect(NotificationMailer).to have_received(:notify_booking_booker).with(booking, a_string_including('John'))
          expect(NotificationMailer).to have_received(:notify_company_booker).with(booking, existing_company_booker_email, a_string_including('John'))
          expect(NotificationMailer).to have_received(:notify_company_booker).with(booking, non_existing_company_booker_email, a_string_including('John'))
        end

        it 'sends message containing driver phone numer' do
          expect(SmsSender).to have_received(:perform_at).with(time_at, phone, a_string_including('07476092612'))
          expect(NotificationMailer).to have_received(:notify_passenger).with(booking, a_string_including('07476092612'))
          expect(NotificationMailer).to have_received(:notify_booking_booker).with(booking, a_string_including('07476092612'))
          expect(NotificationMailer).to have_received(:notify_company_booker).with(booking, existing_company_booker_email, a_string_including('07476092612'))
          expect(NotificationMailer).to have_received(:notify_company_booker).with(booking, non_existing_company_booker_email, a_string_including('07476092612'))
        end

        it 'sends message containing vehicle name' do
          expect(SmsSender).to have_received(:perform_at).with(time_at, phone, a_string_including('123 456'))
          expect(NotificationMailer).to have_received(:notify_passenger).with(booking, a_string_including('123 456'))
          expect(NotificationMailer).to have_received(:notify_booking_booker).with(booking, a_string_including('123 456'))
          expect(NotificationMailer).to have_received(:notify_company_booker).with(booking, existing_company_booker_email, a_string_including('123 456'))
          expect(NotificationMailer).to have_received(:notify_company_booker).with(booking, non_existing_company_booker_email, a_string_including('123 456'))
        end

        it 'sends message containing booking link' do
          link = "http://localhost:3000/s/#{ShortUrl.last.token}"
          expect(SmsSender).to have_received(:perform_at).with(time_at, phone, a_string_including(link))
          expect(NotificationMailer).to have_received(:notify_passenger).with(booking, a_string_including(link))
          expect(NotificationMailer).to have_received(:notify_booking_booker).with(booking, a_string_including(link))
          expect(NotificationMailer).to have_received(:notify_company_booker).with(booking, existing_company_booker_email, a_string_including(link))
          expect(NotificationMailer).to have_received(:notify_company_booker).with(booking, non_existing_company_booker_email, a_string_including(link))
        end
      end
    end

    describe 'email deliver time' do
      let!(:driver) { create(:booking_driver, booking: booking, vehicle: {license_plate: '123 456'}, name: 'John', phone_number: '07476092612') }
      before do
        allow(NotificationMailer).to receive(:notify_passenger).and_return(double.as_null_object)
        service.execute
      end

      context 'when booking status is not on_the_way' do
        let(:booking) { create(:booking, :ot, :order_received, scheduled_at: 5.hours.from_now) }
        it 'sends deliver later with wait until - nil' do
          expect(NotificationMailer.notify_passenger).to have_received(:deliver_later).with(wait_until: nil)
        end
      end

      context 'when order is in on_the_way status' do
        context 'when order scheduled_at less than one hour after notification' do
          let(:vehicle) { create(:vehicle, :one_transport, earliest_available_in: 10) }
          let(:booking) { create(:booking, :on_the_way, vehicle: vehicle, scheduled_at: 10.minutes.from_now) }
          it 'sends deliver later with wait until - nil' do
            expect(NotificationMailer.notify_passenger).to have_received(:deliver_later).with(wait_until: nil)
          end
        end

        context 'when order scheduled_at more than one hour after notification' do
          let(:booking_scheduled_at) { 5.hours.from_now.beginning_of_minute }
          let(:booking) { create(:booking, :ot, :on_the_way, scheduled_at: booking_scheduled_at) }
          let(:expected_scheduled_at) { (booking_scheduled_at - 1.hour).to_time.utc }

          it 'sends deliver later with wait until - nil' do
            expect(NotificationMailer.notify_passenger).to have_received(:deliver_later).with(wait_until: expected_scheduled_at)
          end
        end
      end
    end
  end

  describe '#notify_passenger_with_sms?' do
    let(:notify_passenger_with_push?) { false }

    subject { service.send(:notify_passenger_with_sms?) }

    context 'booking has no passenger' do
      let(:booking) { create(:booking, :ot, :without_passenger) }

      it { is_expected.to be true }
    end

    context 'booking has passenger' do
      let(:booking) { create(:booking, :ot, passenger: passenger) }

      context 'passenger.notify_passenger_with_sms is true' do
        let(:passenger) { create(:passenger, notify_with_sms: true, notify_with_push: false) }

        it { is_expected.to be true }

        context 'when passenger.notify_passenger_with_push is also true' do
          let(:passenger) { create(:passenger, notify_with_sms: true, notify_with_push: true) }

          context 'but there is no registered user device' do
            it { is_expected.to be true }
          end

          context 'passenger has only inactive device registered' do
            before { create(:user_device, :inactive, user: passenger) }

            it { is_expected.to be true }
          end

          context 'there is registered user device' do
            before { create(:user_device, user: passenger) }

            it { is_expected.to be false }

            context 'but when sms delivery was enforced' do
              let(:only)  { :sms }
              let(:force) { true }

              it { is_expected.to be true }
            end
          end
        end
      end

      context 'passenger.notify_passenger_with_sms is false' do
        let(:passenger) { create(:passenger, notify_with_sms: false) }

        it { is_expected.to be false }
      end

      context 'booking source type is API' do
        let(:booking)   { create(:booking, :ot, source_type: 'api', passenger: passenger, company: company) }
        let(:passenger) { create(:passenger, notify_with_sms: true) }

        context 'notifications disabled' do
          let(:company) { create(:company, api_notifications_enabled: false) }

          it { is_expected.to be false }
        end

        context 'notifications enabled' do
          let(:company) { create(:company, api_notifications_enabled: true) }

          it { is_expected.to be true }
        end
      end
    end
  end

  describe '#notify_passenger_with_email?' do
    subject { service.send(:notify_passenger_with_email?) }

    context 'booking has no passenger' do
      let(:booking) { create(:booking, :ot, :without_passenger) }

      it { is_expected.to be false }
    end

    context 'booking has passenger' do
      let(:booking) { create(:booking, :ot, passenger: passenger) }

      context 'passenger.notify_with_email is true' do
        let(:passenger) { create(:passenger, notify_with_email: true) }

        it { is_expected.to be true }
      end

      context 'passenger.notify_with_email is false' do
        let(:passenger) { create(:passenger, notify_with_email: false) }

        it { is_expected.to be false }
      end
    end

    context 'booking source type is API' do
      let(:booking)   { create(:booking, :ot, source_type: 'api', passenger: passenger, company: company) }
      let(:passenger) { create(:passenger, notify_with_email: true) }

      context 'notifications disabled' do
        let(:company) { create(:company, api_notifications_enabled: false) }

        it { is_expected.to be false }
      end

      context 'notifications enabled' do
        let(:company) { create(:company, api_notifications_enabled: true) }

        it { is_expected.to be true }
      end
    end
  end

  describe '#notify_passenger_with_push?' do
    subject { service.send(:notify_passenger_with_push?) }

    context 'booking has no passenger' do
      let(:booking) { create(:booking, :ot, :without_passenger) }

      it { is_expected.to be false }
    end

    context 'booking has passenger' do
      let(:booking) { create(:booking, :ot, passenger: passenger) }

      context 'passenger.notify_with_push is true' do
        let(:passenger) { create(:passenger, notify_with_push: true) }

        context 'but passenger does not have registered user device' do
          it { is_expected.to be false }
        end

        context 'passenger has only inactive device registered' do
          before { create(:user_device, :inactive, user: passenger) }

          it { is_expected.to be false }
        end

        context 'passenger has registered user device' do
          before { create(:user_device, user: passenger) }

          it { is_expected.to be true }
        end
      end

      context 'passenger.notify_with_push is false' do
        let(:passenger) { create(:passenger, notify_with_push: false) }

        it { is_expected.to be false }
      end
    end

    context 'booking source type is API' do
      let(:booking)   { create(:booking, :ot, source_type: 'api', passenger: passenger, company: company) }
      let(:passenger) { create(:passenger, notify_with_push: true) }
      before { create(:user_device, user: passenger) }

      context 'notifications disabled' do
        let(:company) { create(:company, api_notifications_enabled: false) }

        it { is_expected.to be false }
      end

      context 'notifications enabled' do
        let(:company) { create(:company, api_notifications_enabled: true) }

        it { is_expected.to be true }
      end
    end
  end

  describe '#notify_booker_with_email?' do
    let(:passenger) { create(:passenger) }
    let(:booker)    { create(:booker, :with_email_notifications) }
    let(:booking)   { create(:booking, :ot, passenger: passenger, booker: booker) }

    subject { service.send(:notify_booker_with_email?, booker) }

    it { is_expected.to be true }

    context 'booker is passenger' do
      let(:passenger) { booker }

      it { is_expected.to be false }
    end

    context 'booker.notify_with_email? is false' do
      let(:booker) { create(:booker, notify_with_email: false) }

      it { is_expected.to be false }
    end

    context 'when passenger does not exist in our system' do
      let(:booking) { create(:booking, :ot, :without_passenger, booker: booker) }

      it { is_expected.to be true }
    end

    context 'booking source type is API' do
      let(:booking) { create(:booking, :ot, source_type: 'api', passenger: passenger, company: company) }

      context 'notifications disabled' do
        let(:company) { create(:company, api_notifications_enabled: false) }

        it { is_expected.to be false }
      end

      context 'notifications enabled' do
        let(:company) { create(:company, api_notifications_enabled: true) }

        it { is_expected.to be true }
      end
    end
  end

  describe Bookings::NotifyPassenger::Message do
    before { Timecop.freeze('2017-12-17'.to_date) }
    after  { Timecop.return }

    let(:message) { Bookings::NotifyPassenger::Message.new(booking: booking, delivered_at: delivered_at) }
    let(:delivered_at) { DateTime.current }

    before do
      create(:booking_driver, booking: booking)
      allow(message).to receive(:short_link).and_call_original
    end

    describe '#sms for passenger' do
      subject { message.sms }

      context 'when status is order_received' do
        let(:address) { create(:address, :baker_street) }

        context 'when it is asap' do
          let(:booking) { create(:booking, :order_received, :asap, scheduled_at: '2018-09-07 12:00', pickup_address: address) }

          it 'generates valid content' do
            content = message.sms
            expect(message).to have_received(:short_link)
            expect(content).not_to include('07/09/2018')
            expect(content).to include('+44203 608 9312')
          end
        end

        context 'when it is future' do
          let(:booking) { create(:booking, :order_received, :future, scheduled_at: '2018-09-07 12:00', pickup_address: address) }

          it 'generates valid content' do
            content = message.sms
            expect(message).not_to have_received(:short_link)
            expect(content).to include('07/09/2018 13:00')
            expect(content).to include('0345 155 0802')
          end
        end
      end
    end

    describe '#sms for unregistered passenger' do
      context 'when status is on_the_way' do
        let(:booking) { create(:booking, :on_the_way, :without_passenger) }

        it 'does not add short url to message content' do
          expect(message.sms).to be_present
          expect(message).not_to have_received(:short_link)
        end
      end

      context 'when status is order_received' do
        let(:booking) { create(:booking, :order_received, :without_passenger) }

        it 'does not add short url to message content' do
          expect(message.sms).to be_present
          expect(message).not_to have_received(:short_link)
        end
      end

      context 'when status is cancelled' do
        let(:booking) { create(:booking, :cancelled, :without_passenger) }

        it 'does not add short url to message content' do
          expect(message.sms).to be_present
          expect(message).not_to have_received(:short_link)
        end
      end

      describe 'driver name' do
        let(:booking) { create(:booking, :on_the_way, :without_passenger) }

        before { booking.driver.update(name: driver_name) }

        context 'when name is empty' do
          let(:driver_name) { nil }

          it 'renders N/A as driver name' do
            expect(message.sms).to include('N/A')
          end
        end

        context 'when name is on Russian' do
          let(:driver_name) { 'Женя Крыжовников' }

          it 'transliterates driver name' do
            expect(message.sms).to include('Zhenya Krizhovnikov')
          end
        end

        describe 'driver name nonRussian transliteration' do
          let(:driver_name) { 'Πυθαγόρας' }

          it 'keeps original characters' do
            expect(message.sms).to include('Πυθαγόρας')
          end
        end
      end
    end

    describe('#booker_email') do
      subject(:email) { message.booker_email }

      context 'when status is on_the_way' do
        context 'when booking is asap' do
          let(:booking) do
            create(
              :booking,
              :on_the_way,
              :without_passenger,
              passenger_first_name: 'John',
              passenger_last_name: 'Smith'
            )
          end

          it { is_expected.to include 'John Smith' }

          context 'when driver eta is less than 2' do
            it 'uses default eta' do
              expect(email).to include 'in 2 minutes'
            end
          end

          context 'when driver eta is more than 2' do
            let!(:driver2) do
              create(
                :booking_driver,
                booking: booking2,
                vehicle: {
                  license_plate: '123 456'
                },
                name: 'Stas',
                phone_number: '07476092612',
                eta: 5
              )
            end

            let(:booking2) do
              create(
                :booking,
                :on_the_way,
                :without_passenger,
                passenger_first_name: 'Artem',
                passenger_last_name: 'Nilov'
              )
            end

            let(:message) { Bookings::NotifyPassenger::Message.new(booking: booking2, delivered_at: delivered_at) }

            it 'uses driver eta' do
              expect(email).to include 'in 5 minutes'
            end
          end
        end

        context 'when booking is in future' do
          let(:booking) do
            create(
              :booking,
              :future,
              :on_the_way,
              :without_passenger,
              passenger_first_name: 'John',
              passenger_last_name: 'Smith',
              scheduled_at: 2.hours.from_now
            )
          end

          it { is_expected.to include 'John Smith' }
          it { is_expected.to include 'in about 2 hours' }

          context 'when sheduled to send in 1 hour before booking scheduled time' do
            let(:delivered_at) { 1.hour.ago(booking.scheduled_at) }

            it { is_expected.to include 'in about 1 hour' }
          end
        end
      end

      context 'when status is order_received' do
        context 'order is scheduled' do
          let(:booking) { create(:booking, :order_received, :scheduled, scheduled_at: '2017-12-18 12:30+00:00', timezone: 'Europe/Berlin') } # UTC+01:00

          it { is_expected.to include '18/12/2017 13:30' }
        end
      end

      context 'when status is cancelled' do
        let(:booking) { create(:booking, :cancelled, scheduled_at: '2017-12-18 12:30+00:00', timezone: 'Europe/Berlin') }

        it { is_expected.to include '18/12/2017 13:30' }

        context 'when booking is as directed' do
          let(:booking) { create(:booking, :cancelled, destination_address: false) }

          it { is_expected.to match /Your order service-id for a taxi\s+on/m }
        end
      end
    end
  end
end
