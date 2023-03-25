require 'rails_helper'

RSpec.describe Companies::SendBbcNotifications, type: :service do
  let!(:company) { create(:company, :bbc) }

  describe '#execute' do
    subject(:service) { described_class.new(company: company) }

    context 'member pd expires over 30 days' do
       let!(:member) { create(:member, company: company, pd_expires_at: Date.current + 30.days) }

       it 'doesnt send notifications' do
         expect(BbcNotificationsMailer).to_not receive(:pd_expires_soon)
         expect(BbcNotificationsMailer).to_not receive(:pd_expired)
         expect(Messages::CreatePersonal).to_not receive(:new)

         service.execute
       end
    end

    context 'member pd expires over 28 days' do
       let!(:member) { create(:member, company: company, pd_expires_at: Date.current + 28.days) }

       it 'sends email' do
         expect(BbcNotificationsMailer).to_not receive(:pd_expired)
         expect(Messages::CreatePersonal).to_not receive(:new)

         expect(BbcNotificationsMailer).to receive(:pd_expires_soon)
           .with(passenger: member)
           .and_return(double(deliver_later: true))

         service.execute
       end
    end

    context 'member pd expires over 1 day' do
       let!(:member) { create(:member, company: company, pd_expires_at: Date.current + 1.day) }

       it 'sends email and message' do
         expect(BbcNotificationsMailer).to_not receive(:pd_expired)

         expect(Messages::CreatePersonal).to receive(:new)
           .with(recipient: member, message_body: I18n.t('bbc.passenger_notifications.pd_expire_soon'))
           .and_return(double(execute: true))

         expect(BbcNotificationsMailer).to receive(:pd_expires_soon)
           .with(passenger: member)
           .and_return(double(deliver_later: true))

         service.execute
       end
    end

    context 'member pd expires today' do
       let!(:member) { create(:member, company: company, pd_expires_at: Date.current) }

       it 'sends email and message' do
         expect(BbcNotificationsMailer).to_not receive(:pd_expires_soon)

         expect(Messages::CreatePersonal).to receive(:new)
           .with(recipient: member, message_body: I18n.t('bbc.passenger_notifications.pd_expired'))
           .and_return(double(execute: true))

         expect(BbcNotificationsMailer).to receive(:pd_expired)
           .with(passenger: member)
           .and_return(double(deliver_later: true))

         service.execute
       end
    end
  end
end
