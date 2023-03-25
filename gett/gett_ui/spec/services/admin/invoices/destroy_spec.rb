require 'rails_helper'

RSpec.describe Admin::Invoices::Destroy, type: :service do
  let(:admin) { create(:admin) }
  subject(:service) { Admin::Invoices::Destroy.new(invoice: invoice) }

  describe '#execute' do
    before { service.execute }

    context 'issued credit note' do
      let(:invoice) { create(:credit_note) }

      it { is_expected.to be_success }

      it 'deletes invoice' do
        expect(Invoice.with_pk(invoice.id)).to be_nil
      end
    end

    context 'applied credit note' do
      let(:invoice) { create(:credit_note, credited_invoice: create(:invoice)) }

      it { is_expected.to_not be_success }

      it 'does not delete invoice' do
        expect(Invoice.with_pk(invoice.id)).to be_present
      end
    end

    context 'regular invoice' do
      let(:invoice) { create(:invoice) }

      it { is_expected.to_not be_success }

      it 'does not delete invoice' do
        expect(Invoice.with_pk(invoice.id)).to be_present
      end
    end
  end
end
