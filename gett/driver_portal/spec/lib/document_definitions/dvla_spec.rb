require 'rails_helper'
require 'document_definitions/dvla'

RSpec.describe DocumentDefinitions::Dvla do
  describe '#apply_metadata_changes!' do
    subject { described_class.new(document) }

    let(:document) { create :document, metadata: metadata }

    context 'with all metadata' do
      let(:metadata) do
        {
          expiry_date: Date.today,
          license_number: 'New license number',
          date_of_birth: Date.tomorrow,
          postcode: 'New postcode'
        }
      end

      it 'updates document' do
        subject.apply_metadata_changes!
        expect(document.reload.expires_at.to_date).to eq(metadata[:expiry_date])
      end

      it 'updates driver' do
        subject.apply_metadata_changes!
        expect(document.user.reload.license_number).to eq(metadata[:license_number])
        expect(document.user.reload.birth_date).to eq(metadata[:date_of_birth])
        expect(document.user.reload.postcode).to eq(metadata[:postcode])
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
