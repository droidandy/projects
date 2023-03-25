require 'rails_helper'
require 'document_definitions/phvl_back'

RSpec.describe DocumentDefinitions::PhvlBack do
  describe '#apply_metadata_changes!' do
    subject { described_class.new(document) }

    let(:document) { create :document, :vehicle_bound, metadata: metadata }

    context 'with all metadata' do
      let(:metadata) do
        {
          expiry_date: Date.today + 1.week
        }
      end

      it 'updates document' do
        subject.apply_metadata_changes!
        expect(document.reload.expires_at.to_date).to eq(metadata[:expiry_date])
      end
    end

    context 'with empty metadata' do
      let(:metadata) do
        {}
      end

      it 'still works' do
        subject.apply_metadata_changes!
      end
    end
  end
end
