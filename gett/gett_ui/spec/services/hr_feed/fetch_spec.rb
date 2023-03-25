require 'rails_helper'
require 'net/sftp'

RSpec.describe HrFeed::Fetch, type: :service do
  describe '#execute' do
    let(:company) do
      create(:company, sftp_username: 'hr_username', sftp_password: 'hr_password')
    end

    subject(:service) { described_class.new(company: company) }

    before do
      expect(Net::SFTP).to receive(:start)
        .with('sftp_endpoint', 'hr_username', port: 22, password: 'hr_password', compression: false)

      import_service = double('Passengers::AutomaticImport')

      expect(Passengers::AutomaticImport).to receive(:new)
        .with(company: company, csv_file_path: anything)
        .and_return(import_service)

      expect(import_service).to receive(:execute)
    end

    it 'downloads and imports a csv' do
      service.execute
    end
  end
end
