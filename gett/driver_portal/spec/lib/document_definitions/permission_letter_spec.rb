require 'rails_helper'
require 'document_definitions/permission_letter'

RSpec.describe DocumentDefinitions::PermissionLetter do
  describe '#apply_metadata_changes!' do
    subject { described_class.new(document) }

    let(:document) { create :document, :vehicle_bound, metadata: metadata }

    context 'with all metadata' do
      context 'with return date stated' do
        let(:metadata) do
          {
            expiry_date: Date.today + 1.week,
            return_date_stated: true,
            sign_date: Date.today - 1.month
          }
        end

        it 'updates document' do
          subject.apply_metadata_changes!
          expect(document.reload.expires_at.to_date).to eq(metadata[:expiry_date])
        end
      end

      context 'with return date not stated' do
        let(:metadata) do
          {
            expiry_date: Date.today + 1.week,
            return_date_stated: false,
            sign_date: Date.today - 1.month
          }
        end

        it 'updates document' do
          subject.apply_metadata_changes!
          expect(document.reload.expires_at.to_date).to eq((metadata[:sign_date] + 90.days).to_date)
        end
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
