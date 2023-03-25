require 'rails_helper'
require 'document_definitions/mot'

RSpec.describe DocumentDefinitions::Mot do
  describe '#apply_metadata_changes!' do
    subject { described_class.new(document) }

    let(:document) { create :document, :vehicle_bound, metadata: metadata }

    context 'with all metadata' do
      let(:metadata) do
        {
          registration: 'New registration',
          make: 'New make',
          model: 'New model',
          color: 'New color',
          issue_date: Date.today - 1.week
        }
      end

      it 'updates document' do
        subject.apply_metadata_changes!
        expect(document.reload.expires_at.to_date).to eq(metadata[:issue_date] + 6.month)
      end

      it 'updates vehicle' do
        subject.apply_metadata_changes!
        expect(document.vehicle.reload.plate_number).to eq(metadata[:registration])
        expect(document.vehicle.reload.color).to eq(metadata[:color])
        expect(document.vehicle.reload.model).to eq(metadata[:model])
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
