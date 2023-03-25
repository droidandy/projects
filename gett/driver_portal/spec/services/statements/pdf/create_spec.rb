require 'rails_helper'

RSpec.describe Statements::PDF::Create do
  describe '#execute!' do
    let(:current_user) { create :user }

    let(:params) do
      {
        statement_id: 1
      }
    end

    subject { described_class.new(current_user, params) }

    before(:each) do
      allow_any_instance_of(WickedPdf).to receive(:pdf_from_string).and_return('converted pdf')
    end

    context 'when HTML got successfully' do
      before(:each) do
        stub_service(Statements::GetHTML, html: 'statement_html')
      end

      it 'runs successfully' do
        subject.execute!
        expect(subject).to be_success
        expect(subject.pdf_data).to be_present
      end
    end

    context 'with invalid HTML call' do
      let(:errors) { { a: :b } }

      before(:each) do
        stub_service(Statements::GetHTML, false, html: nil, errors: errors)
      end

      it 'fails' do
        subject.execute!
        expect(subject).not_to be_success
        expect(subject.pdf_data).to be_nil
        expect(subject.errors).to eq errors
      end
    end
  end
end
