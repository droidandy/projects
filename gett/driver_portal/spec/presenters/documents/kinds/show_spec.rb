require 'rails_helper'

RSpec.describe Documents::Kinds::Show do
  subject { described_class.new(kind) }

  let(:kind) { create(:documents_kind) }

  describe '#as_json' do
    let(:json) do
      {
        id: kind.id,
        title: kind.title,
        slug: kind.slug,
        mandatory: kind.mandatory,
        owner: kind.owner
      }
    end

    it 'returns proper json' do
      expect(subject.as_json).to eq(json)
    end

    context 'with fields option' do
      let!(:fields) { create_list :documents_field, 2, kind: kind }

      it 'should render fields array' do
        expect(subject.as_json(with_fields: true)[:fields].count).to eq(2)
      end
    end
  end
end
