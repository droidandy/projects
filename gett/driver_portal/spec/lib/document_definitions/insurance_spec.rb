require 'rails_helper'
require 'document_definitions/insurance'

RSpec.describe DocumentDefinitions::Insurance do
  describe '#apply_metadata_changes!' do
    subject { described_class.new(document) }

    let(:document) { create :document, :vehicle_bound, metadata: metadata }

    context 'with all metadata' do
      let(:metadata) do
        {
          expires_at: (Time.current + 1.week).iso8601,
          registration: 'New registration',
          insurance_company: 'New insurance company',
          policyholder: 'New policyholder',
          limitations: 'New limitations'
        }
      end

      it 'updates document' do
        subject.apply_metadata_changes!
        expect(document.reload.expires_at).to eq(metadata[:expires_at])
      end

      it 'updates vehicle' do
        subject.apply_metadata_changes!
        expect(document.vehicle.reload.plate_number).to eq(metadata[:registration])
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
