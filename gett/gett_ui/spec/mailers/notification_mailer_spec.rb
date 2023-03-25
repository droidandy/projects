require 'rails_helper'

describe NotificationMailer, type: :mailer do
  let(:company)   { create(:company) }
  let(:booker)    { create(:booker, company: company) }
  let(:passenger) { create(:passenger, company: company) }
  let(:booking)   { create(:booking, booker: booker, passenger: passenger, status: status) }
  let(:status)    { 'order_received' }
  let(:distance_service_stub) do
    double(execute: double(success?: true, result: { success?: true, distance: 10.0 }))
  end

  before { allow(GoogleApi::FindDistance).to receive(:new).and_return(distance_service_stub) }

  describe '#notify_passenger' do
    let(:mail) { described_class.notify_passenger(booking, 'message') }

    describe 'mail subject' do
      subject { mail.subject }

      it { is_expected.to eql 'We’ve received your ' + booking.service_id + ' order' }

      context 'status is on_the_way' do
        let(:status) { 'on_the_way' }

        it { is_expected.to eql 'Your driver is on the way for ' + booking.service_id }
      end

      context 'status is arrived' do
        let(:status) { 'arrived' }

        it { is_expected.to eql 'Your driver is here for ' + booking.service_id }
      end
    end

    it 'renders the receiver email' do
      expect(mail.to).to eql [passenger.email]
    end

    it 'renders the sender email' do
      expect(mail.from).to eql ['donotreply@gett.com']
    end

    describe 'calendar event as attachment' do
      let(:passenger) { create(:passenger, notify_with_calendar_event: true, company: company) }
      subject { mail.attachments }

      context 'asap booking' do
        let(:booking) { create(:booking, :asap, booker: booker, passenger: passenger, status: status) }

        it { is_expected.to be_empty }
      end

      context 'future booking' do
        let(:booking) { create(:booking, :scheduled, booker: booker, passenger: passenger, status: status) }

        context 'passenger with enabled calendar notifications' do
          context 'booking has order_redceived status' do
            it { is_expected.not_to be_empty }

            context 'as directed booking' do
              let(:booking) { create(:booking, :scheduled, booker: booker, passenger: passenger, status: status, destination_address: false) }

              it { is_expected.not_to be_empty }
            end
          end

          context 'booking has not order_received status' do
            let(:status) { 'on_the_way' }

            it { is_expected.to be_empty }
          end
        end

        context 'passenger with disabled calendar notifications' do
          let(:passenger) { create :passenger, notify_with_calendar_event: false }
          it { is_expected.to be_empty }
        end
      end
    end
  end

  describe '#notify_booking_booker' do
    let(:mail) { described_class.notify_booking_booker(booking, 'message') }

    describe 'mail subject' do
      subject { mail.subject }

      it { is_expected.to eql 'We’ve received your ' + booking.service_id + ' order' }

      context 'status is on_the_way' do
        let(:status) { 'on_the_way' }

        it { is_expected.to eql 'Your driver is on the way for ' + booking.service_id }
      end

      context 'status is arrived' do
        let(:status) { 'arrived' }

        it { is_expected.to eql 'Your driver is here for ' + booking.service_id }
      end
    end

    it 'renders the receiver email' do
      expect(mail.to).to eql [booker.email]
    end

    it 'renders the sender email' do
      expect(mail.from).to eql ['donotreply@gett.com']
    end

    describe "extra block content" do
      context 'when status is order_received' do
        let(:status) { 'order_received' }

        it "doesn't have extra block content in mail body" do
          expect(mail.body).not_to include('Track your order in Gett Business Solutions app')
        end
      end

      context 'when status is on_the_way' do
        let(:status) { 'on_the_way' }

        it "doesn't have block content in mail body" do
          expect(mail.body).not_to include('Track your order in Gett Business Solutions app')
        end
      end

      context 'when status not order_received or on_the_way' do
        let(:status) { 'arrived' }

        it "doesn't have extra block content in mail body" do
          expect(mail.body).not_to include('Track your order in Gett Business Solutions app')
        end
      end

      context 'when company is not enterprise' do
        let(:company) { create(:company, :bbc) }

        it "doesn't have extra block content in mail body" do
          expect(mail.body).not_to include('Track your order in Gett Business Solutions app')
        end
      end
    end

    describe 'calendar event as attachment' do
      subject { mail.attachments }

      context 'asap booking' do
        let(:booking) { create(:booking, :asap, booker: booker, passenger: passenger, status: status) }

        it { is_expected.to be_empty }
      end

      context 'future booking' do
        let(:booking) { create(:booking, :scheduled, booker: booker, passenger: passenger, status: status) }

        context 'booking has order_redceived status' do
          it { is_expected.not_to be_empty }

          context 'as directed booking' do
            let(:booking) { create(:booking, :scheduled, booker: booker, passenger: passenger, status: status, destination_address: false) }

            it { is_expected.not_to be_empty }
          end
        end

        context 'booking has not order_received status' do
          let(:status) { 'on_the_way' }

          it { is_expected.to be_empty }
        end
      end
    end
  end

  describe '#notify_company_booker' do
    let(:mail) { described_class.notify_company_booker(booking, booker.email, 'message') }

    describe 'mail subject' do
      subject { mail.subject }

      it { is_expected.to eql 'We’ve received your ' + booking.service_id + ' order' }

      context 'status is on_the_way' do
        let(:status) { 'on_the_way' }

        it { is_expected.to eql 'Your driver is on the way for ' + booking.service_id }
      end

      context 'status is arrived' do
        let(:status) { 'arrived' }

        it { is_expected.to eql 'Your driver is here for ' + booking.service_id }
      end
    end

    it 'renders the receiver email' do
      expect(mail.to).to eql [booker.email]
    end

    it 'renders the sender email' do
      expect(mail.from).to eql ['donotreply@gett.com']
    end

    describe "extra block content" do
      context 'when status is order_received' do
        let(:status) { 'order_received' }

        it 'has extra block content in mail body' do
          expect(mail.body).to include('Track your order in Gett Business Solutions app')
        end
      end

      context 'when status is on_the_way' do
        let(:status) { 'on_the_way' }

        it 'has extra block content in mail body' do
          expect(mail.body).to include('Track your order in Gett Business Solutions app')
        end
      end

      context 'when status not order_received or on_the_way' do
        let(:status) { 'arrived' }

        it "doesn't have extra block content in mail body" do
          expect(mail.body).not_to include('Track your order in Gett Business Solutions app')
        end
      end

      context 'when company is not enterprise' do
        let(:company) { create(:company, :bbc) }

        it "doesn't have extra block content in mail body" do
          expect(mail.body).not_to include('Track your order in Gett Business Solutions app')
        end
      end
    end

    describe 'calendar event as attachment' do
      subject(:attachments) { mail.attachments }

      context 'asap booking' do
        let(:booking) { create(:booking, :asap, booker: booker, passenger: passenger, status: status) }

        it { is_expected.to be_empty }
      end

      context 'future booking' do
        let(:booking) { create(:booking, :scheduled, booker: booker, passenger: passenger, status: status) }

        context 'booking has order_redceived status' do
          it { is_expected.not_to be_empty }

          it 'includes UTC timestamps' do
            attachment = attachments.first.to_s
            timestamp = booking.scheduled_at.utc.strftime('%Y%m%dT%H%M%SZ')
            expect(attachment).to include("DTSTART:#{timestamp}")
          end

          context 'as directed booking' do
            let(:booking) { create(:booking, :scheduled, booker: booker, passenger: passenger, status: status, destination_address: false) }

            it { is_expected.not_to be_empty }
          end
        end

        context 'booking has not order_received status' do
          let(:status) { 'on_the_way' }

          it { is_expected.to be_empty }
        end
      end
    end
  end
end
