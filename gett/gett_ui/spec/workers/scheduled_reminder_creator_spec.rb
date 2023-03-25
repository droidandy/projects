require 'rails_helper'

RSpec.describe ScheduledReminderCreator, type: :worker do
  let(:worker) { ScheduledReminderCreator.new }

  describe '#perform' do
    let(:account_manager) { create(:user, :sales) }
    let!(:companyadmin) { create(:companyadmin, company: company) }
    let!(:company) { create(:company, account_manager_id: account_manager.id) }

    context 'remindable invoices exists' do
      let!(:two_days_to_overdue_invoice) { create(:invoice, overdue_at: Date.current + 2.days, company: company) }
      let!(:one_day_overdue_invoice) { create(:invoice, overdue_at: Date.current - 1.day, company: company) }
      let!(:fifteen_days_overdue_invoice) { create(:invoice, overdue_at: Date.current - 15.days, company: company) }
      let!(:twenty_two_days_overdue_invoice) { create(:invoice, overdue_at: Date.current - 22.days, company: company) }

      it 'sends reminders' do
        expect{ worker.perform }.to change(ActionMailer::Base.deliveries, :size).by(5)
      end
    end

    context 'no remindable invoices exists' do
      let!(:invoice) { create(:invoice, company: company, overdue_at: 3.days.from_now) }

      it 'does not send reminders' do
        expect{ worker.perform }.to change(ActionMailer::Base.deliveries, :size).by(0)
      end
    end
  end
end
