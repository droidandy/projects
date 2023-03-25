require 'rails_helper'

RSpec.describe ::Users::Approval::Notification do
  let(:user) { create(:user, :with_site_admin_role) }
  let(:driver) { create(:user, :with_driver_role) }
  let(:vehicle) { create(:vehicle, user: driver, title: 'Bugatti Chiron') }
  let(:driver_documents_kind) { create(:documents_kind, title: 'Driver Doc') }
  let(:vehicle_documents_kind) { create(:documents_kind, title: 'Vehicle Doc', owner: :vehicle) }
  let!(:driver_document) { create(:document, user: driver, kind: driver_documents_kind) }
  let!(:vehicle_document) { create(:document, :vehicle_bound, vehicle: vehicle, kind: vehicle_documents_kind) }

  subject { described_class.new(user, { user_id: driver.id }) }

  context 'driver and vehicle approved' do
    before do
      [driver, vehicle, driver_document, vehicle_document].each do |record|
        record.update!(approval_status: :approved)
      end
    end

    it 'returns mail subject and message' do
      result = subject.as_json
      expect(result[:subject]).to eq('Documents approved')
      expect(result[:message]).to eq('Thank you for documents uploading. All your documents are approved.')
    end
  end

  context 'vehicle not approved' do
    before do
      [driver, driver_document].each do |record|
        record.update!(approval_status: :approved)
      end
      [vehicle, vehicle_document].each do |record|
        record.update!(approval_status: :rejected)
      end
      create(:documents_status_change, document: vehicle_document, comment: 'Comment')
    end

    it 'returns mail subject and message' do
      result = subject.as_json
      expect(result[:subject]).to eq('Some documents were rejected')
      expect(result[:message]).to eq(<<-TEXT.strip_heredoc)
        Bugatti Chiron - Vehicle Doc
        Reject reason:
        Comment
      TEXT
    end
  end

  context 'driver not approved' do
    before do
      [vehicle, vehicle_document].each do |record|
        record.update!(approval_status: :approved)
      end
      [driver, driver_document].each do |record|
        record.update!(approval_status: :rejected)
      end
      create(:documents_status_change, document: driver_document, comment: 'Comment')
    end

    it 'returns mail subject and message' do
      result = subject.as_json
      expect(result[:subject]).to eq('Some documents were rejected')
      expect(result[:message]).to eq(<<-TEXT.strip_heredoc)
        Driver document - Driver Doc
        Reject reason:
        Comment
      TEXT
    end
  end
end
