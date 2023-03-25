require 'rails_helper'

RSpec.describe Receipts::Notifier, type: :service do
  before { Timecop.freeze('2017-11-06'.to_datetime) }
  after  { Timecop.return }

  let(:company)    { create :company, :enterprise }
  let(:booker)     { create :booker, company: company }
  let(:passenger1) { create :passenger, company: company, booker_pks: [booker.id] }
  let(:passenger2) { create :passenger, company: company }
  let(:passenger3) { create :passenger, company: company }
  let(:passenger4) { create :passenger, company: company, booker_pks: [booker.id] }
  let(:booking1)   { create :booking, :personal_card, :completed, ended_at: 1.day.ago, passenger: passenger1 }
  let(:booking2)   { create :booking, :business_card, :completed, ended_at: 2.days.ago, passenger: passenger2 }
  let(:booking3)   { create :booking, :completed, ended_at: 2.days.ago, passenger: passenger3 }
  let(:booking4) do
    create(
      :booking, :personal_card, :completed,
      ended_at: 2.days.ago,
      passenger: passenger4,
      booker: passenger4
    )
  end

  before do
    create(:booking, :in_progress, passenger: passenger1)
    create(:booking, :completed, ended_at: 8.days.ago, passenger: passenger4)

    create(:payment, :captured, booking: booking1)
    create(:payment, :captured, booking: booking2)
    create(:payment, booking: booking3)
    create(:payment, :captured, booking: booking4)
  end

  describe '#execute' do
    subject(:service) { Receipts::Notifier.new }

    let(:email_double) { double(deliver_later: true) }
    let(:email_params) do
      {
        from_date: "30 October ‘17",
        to_date:   "05 November ‘17",
        zip_path:  anything
      }
    end

    it 'calls ZipBunch and enques emails for passengers that have billed bookings and their bookers' do
      allow(Documents::Receipt).to receive_message_chain(:new, :execute, :result).and_return('receipt')

      allow(ReceiptsMailer).to receive(:receipts_for_passenger).and_return(email_double)
      allow(ReceiptsMailer).to receive(:receipts_for_booker).and_return(email_double)

      expect(ReceiptsMailer).to receive(:receipts_for_passenger).with(passenger1, email_params)
      expect(ReceiptsMailer).to receive(:receipts_for_booker).with(booker, passenger1, email_params)
      expect(ReceiptsMailer).to receive(:receipts_for_passenger).with(passenger2, email_params)

      expect(ReceiptsMailer).to receive(:receipts_for_passenger).with(passenger4, email_params)
      expect(ReceiptsMailer).not_to receive(:receipts_for_booker).with(booker, passenger4, email_params)

      service.execute
    end
  end
end
