require 'rails_helper'

RSpec.describe Documents::CreditNote, type: :service do
  before { Timecop.freeze '2017-09-01'.to_date }
  after  { Timecop.return }

  let(:company)     { create(:company) }
  let(:credit_note) { create(:credit_note, :with_lines, company: company) }

  let(:service) { Documents::CreditNote.new(credit_note_id: credit_note.id) }

  service_context { { user: create(:user, :admin), back_office: true } }

  it { is_expected.to be_authorized_by(Admin::Documents::InvoicePolicy) }

  context 'when executed in front office' do
    service_context { {user: create(:admin, company: company), front_office: true, back_office: false} }

    it { is_expected.to be_authorized_by(Documents::InvoicePolicy) }
  end

  describe '#template_assigns' do
    subject(:assigns) { service.template_assigns }

    it {
      is_expected.to include(
        company:           company,
        contact:           company.admin,
        credit_note:       credit_note,
        credit_note_date:  "1st September 2017"
      )
    }

    describe ':credit_note_lines' do
      subject(:lines) { assigns[:credit_note_lines] }

      specify { expect(lines).to match_array credit_note.credit_note_lines }
    end
  end
end
