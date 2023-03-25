require 'rails_helper'
require 'net/sftp'

RSpec.describe Admin::BookingReferences::Fetch do
  describe '#execute' do
    let(:company) do
      create(:company, sftp_username: 'sftp_username', sftp_password: 'sftp_password')
    end

    let(:booking_reference) do
      create(:booking_reference, company: company)
    end

    subject(:service) do
      Admin::BookingReferences::Fetch.new(booking_reference: booking_reference)
    end

    before do
      expect(Net::SFTP).to receive(:start)
        .with('sftp_endpoint', 'sftp_username', port: 22, password: 'sftp_password', compression: false)

      update_service = double('Admin::BookingReferences::Update')

      expect(Admin::BookingReferences::Update).to receive(:new)
        .with(booking_reference: booking_reference, params: { attachment: anything }, sftp_upload: true)
        .and_return(update_service)

      expect(update_service).to receive(:execute).and_return(update_service)
      expect(update_service).to receive(:success?).and_return(true)
    end

    it 'downloads and imports references' do
      expect(service.execute).to be_success
    end
  end
end
