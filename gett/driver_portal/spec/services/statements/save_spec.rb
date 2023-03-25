require 'rails_helper'

RSpec.describe Statements::Save do
  describe '#execute!' do
    let(:current_user) { create :user, :with_driver_role }
    let(:statement_id) { 1 }
    let(:pdf_data) { 'converted pdf' }

    let(:params) do
      {
        statement_id: statement_id,
        pdf_data: pdf_data
      }
    end

    subject { described_class.new(current_user, params) }

    context 'when there is saved statement' do
      let!(:statement) { create :statement, external_id: statement_id, user: current_user }

      it 'runs successfully and update pdf' do
        subject.execute!
        expect(subject).to be_success
        expect(subject.statement.id).to eq(statement.id)
      end
    end

    context 'when no saved statement' do
      it 'saves valid pdf' do
        expect { subject.execute! }.to change { Statement.count }.by(1)
        expect(subject).to be_success
        expect(subject.statement.external_id).to eq(statement_id.to_s)
        expect(subject.statement.pdf).to be_present
      end
    end
  end
end
