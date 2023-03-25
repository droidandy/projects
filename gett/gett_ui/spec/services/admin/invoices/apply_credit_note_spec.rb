require 'rails_helper'

RSpec.describe Admin::Invoices::ApplyCreditNote, type: :service do
  it { is_expected.to be_authorized_by(Admin::Invoices::Policy) }

  service_context { { admin: create(:admin) } }

  subject(:service) do
    Admin::Invoices::ApplyCreditNote.new(invoice: invoice)
  end

  let(:invoice) { create(:credit_note) }

  describe '#execute' do
    before { service.execute }

    it { is_expected.to be_success }

    it 'sets "applied_manually" to "true"' do
      expect(invoice.reload.applied_manually).to eq(true)
    end

    context 'invoice is not a credit note' do
      let(:invoice) { create(:invoice) }

      it { is_expected.not_to be_success }
    end
  end
end
