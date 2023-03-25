require 'rails_helper'

RSpec.describe Documents::GroupedIndex do
  subject { described_class.new(documents) }

  let(:required_kind) { create :documents_kind, mandatory: true }
  let(:required_docs) { create_list :document, 3, kind: required_kind }

  let(:optional_kind) { create :documents_kind, mandatory: false }
  let(:optional_docs) { create_list :document, 2, kind: optional_kind }

  let(:documents) { required_docs + optional_docs }

  describe '#as_json' do
    it 'groups documents' do
      result = subject.as_json
      expect(result[:documents][:required].count).to eq(3)
      expect(result[:documents][:optional].count).to eq(2)
    end

    context 'with empty group' do
      let(:optional_docs) { [] }

      it 'still works' do
        result = subject.as_json
        expect(result[:documents][:required].count).to eq(3)
        expect(result[:documents][:optional].count).to eq(0)
      end
    end
  end
end
