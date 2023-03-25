require 'rails_helper'

RSpec.describe Statements::PDF::Store do
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

    context 'with valid response' do
      let(:created_statement) { create :statement, external_id: statement_id, user: current_user }
      before(:each) do
        stub_service(Statements::PDF::Create, pdf_data: pdf_data)
        stub_service(Statements::Save, statement: created_statement)
      end

      it 'runs successfully and return valid statement' do
        subject.execute!
        expect(subject).to be_success
        expect(subject.statement).to eq(created_statement)
      end
    end

    context 'with invalid HTML response' do
      before(:each) do
        stub_service(Statements::PDF::Create, false, pdf_data: nil, errors: errors)
      end

      it 'fails' do
        subject.execute!
        expect(subject).not_to be_success
        expect(subject.errors).to eq(errors)
      end
    end

    context 'with invalid PDF response' do
      before(:each) do
        stub_service(Statements::PDF::Create, pdf_data: pdf_data)
        stub_service(Statements::Save, false, statement: nil, errors: errors)
      end

      it 'fails' do
        subject.execute!
        expect(subject).not_to be_success
        expect(subject.errors).to eq(errors)
      end
    end
  end
end
