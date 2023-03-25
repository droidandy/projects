require 'rails_helper'

describe BbcNotificationsMailer, type: :mailer do
  let(:company) { create(:company, :bbc) }
  let(:booking) { create(:booking, company: company) }
  let(:passenger) { booking.passenger }

  describe '#ride_over_mileage_limit_email' do
    subject(:mail) do
      described_class.ride_over_mileage_limit_email(
        booking: booking,
        ww_ride: true,
        excess_mileage: 40,
        excess_mileage_cost: 5
      )
    end

    it { expect(mail.to).to include passenger.email }
    it { expect(mail.subject).to eq 'A salary charge applies' }
    it { expect(mail.body.encoded).to include "Dear #{passenger.full_name}" }
  end

  describe '#ride_outside_lnemt_email' do
    subject(:mail) do
      described_class.ride_outside_lnemt_email(
        booking: booking,
        lnemt_start: '22:00',
        lnemt_end: '06:00'
      )
    end

    it { expect(mail.to).to include passenger.email }
    it { expect(mail.subject).to eq 'A salary charge applies' }
    it { expect(mail.body.encoded).to include "Dear #{passenger.full_name}" }
  end

  describe '#pd_expires_soon' do
    subject(:mail) { described_class.pd_expires_soon(passenger: passenger) }

    it { expect(mail.to).to include passenger.email }
    it { expect(mail.subject).to eq 'Passenger Declaration' }
    it { expect(mail.body.encoded).to include "Dear #{passenger.full_name}" }
  end

  describe '#pd_expired' do
    subject(:mail) { described_class.pd_expired(passenger: passenger) }

    it { expect(mail.to).to include passenger.email }
    it { expect(mail.subject).to eq 'Your Passenger Declaration has expired' }
    it { expect(mail.body.encoded).to include "Dear #{passenger.full_name}" }
  end

  describe '#please_update_pd' do
    subject(:mail) { described_class.please_update_pd(passenger: passenger) }

    it { expect(mail.to).to include passenger.email }
    it { expect(mail.subject).to eq 'Passenger Declaration' }
    it { expect(mail.body.encoded).to include "Dear #{passenger.full_name}" }
  end
end
