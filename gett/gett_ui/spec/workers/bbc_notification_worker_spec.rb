require 'rails_helper'

RSpec.describe BbcNotificationWorker, type: :worker do
  subject(:worker) { described_class.new }

  describe '#perform' do
    let!(:bbc_company) { create(:company, :bbc) }
    let!(:inactive_bbc_company) { create(:company, :bbc, active: false) }
    let!(:enterprise_company) { create(:company) }

    it 'expects to call notification sender only for active bbc company' do
      expect(Companies::SendBbcNotifications).not_to receive(:new)
        .with(company: enterprise_company)

      expect(Companies::SendBbcNotifications).not_to receive(:new)
        .with(company: inactive_bbc_company)

      expect(Companies::SendBbcNotifications).to receive(:new)
        .with(company: bbc_company)
        .and_return(double(execute: true))

      worker.perform
    end
  end
end
