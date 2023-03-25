require 'rails_helper'
require 'document_definitions/v5_logbook'

RSpec.describe DocumentDefinitions::V5Logbook do
  describe '#apply_metadata_changes!' do
    subject { described_class.new(document) }

    let(:document) { create :document, :vehicle_bound, metadata: metadata }

    context 'with all metadata' do
      let(:metadata) do
        {
          postcode: 'New postcode',
          registration: 'New registration',
          registration_date: Date.today - 1.day,
          acquirement_date: Date.today - 1.week,
          make: 'New make',
          model: 'New model',
          color: 'New color',
          taxation_class: 'New taxation class',
          is_temporary: true,
          owner: 'New owner'
        }
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
