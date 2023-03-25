require 'rails_helper'

RSpec.describe Documents::Fields::Show do
  subject { described_class.new(field) }

  let(:field) { create(:documents_field) }

  describe '#as_json' do
    let(:json) do
      {
        label: field.label,
        mandatory: field.mandatory,
        name: field.name,
        type: field.field_type
      }
    end

    it 'returns proper json' do
      expect(subject.as_json).to eq(json)
    end
  end
end
