require 'rails_helper'

RSpec.describe Admin::Invoices::IssueCreditNote, type: :service do
  it { is_expected.to be_authorized_by(Admin::Invoices::Policy) }

  let(:company)  { create(:company) }
  let(:invoice)  { create(:invoice, company: company) }
  let(:booking1) { create(:booking, :without_passenger, company: company) }
  let(:booking2) { create(:booking, :without_passenger, company: company) }
  let(:admin)    { create(:admin, company: company) }

  service_context { { admin: admin } }

  subject(:service) do
    Admin::Invoices::IssueCreditNote.new(
      invoice: invoice,
      credit_note_lines: [
        { booking_id: booking1.id, amount: 10, vatable: true },
        { booking_id: booking2.id, amount: 5 }
      ]
    )
  end

  describe '#execute' do
    let(:credit_note) { service.result }

    it 'executes successfully' do
      expect(service.execute).to be_success
    end

    it 'creates a credit note' do
      expect{ service.execute }
        .to change(Invoice.credit_notes, :count).by(1)
        .and change(CreditNoteLine, :count).by(2)

      expect(credit_note.type).to eq('credit_note')
      expect(credit_note.company).to eq(invoice.company)
      expect(credit_note.amount_cents).to eq(1700)
      expect(credit_note.created_by_id).to eq(admin.id)
    end

    it 'sends an email notification' do
      notify_service = double('Invoices::NotifyCompany')
      expect(Invoices::NotifyCompany).to receive(:new).with(invoice: anything).and_return(notify_service)
      expect(notify_service).to receive_message_chain(:execute, :result)
      service.execute
    end

    describe 'created credit_note_lines' do
      subject(:line) { credit_note.credit_note_lines.find{ |l| l.booking_id == booking1.id } }

      before { service.execute }

      it { is_expected.to be_vatable }
      its(:amount_cents) { is_expected.to eq 1000 }
    end
  end
end
