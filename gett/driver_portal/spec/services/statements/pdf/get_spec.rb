require 'rails_helper'

RSpec.describe Statements::PDF::Get do
  describe '#execute!' do
    let(:pdf_data) { 'converted pdf' }
    let(:current_user) { create :user, :with_driver_role }
    let(:statement_id) { 1 }
    let(:errors) { { a: :b } }

    let(:params) do
      {
        statement_id: statement_id
      }
    end

    subject { described_class.new(current_user, params) }

    context 'when there is saved statement' do
      let!(:statement) { create :statement, external_id: statement_id, user: current_user }

      it 'runs successfully and return valid pdf' do
        subject.execute!
        expect(subject).to be_success
        expect(subject.pdf_data).to be_present
      end
    end

    context 'when no saved statement' do
      context 'with valid response' do
        let(:created_statement) { create :statement, external_id: statement_id, user: current_user }
        before(:each) do
          stub_service(Statements::PDF::Store, statement: created_statement)
        end

        it 'runs successfully and return valid pdf' do
          subject.execute!
          expect(subject).to be_success
          expect(subject.pdf_data).to be_present
        end
      end

      context 'with invalid result' do
        before(:each) do
          stub_service(Statements::PDF::Store, false, statement: nil, errors: errors)
        end

        it 'fails' do
          subject.execute!
          expect(subject).not_to be_success
          expect(subject.errors).to eq(errors)
        end
      end
    end
  end
end
