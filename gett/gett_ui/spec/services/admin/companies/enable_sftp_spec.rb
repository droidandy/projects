require 'rails_helper'

RSpec.describe Admin::Companies::EnableSftp, type: :service do
  let!(:company) { create(:company) }

  subject(:service) { Admin::Companies::EnableSftp.new(company: company) }

  describe '#execute' do
    let(:client)   { double('CerberusClient') }
    let(:password) { 'password' }

    before do
      expect(CerberusClient).to receive(:new).and_return(client)
      expect(SecureRandom).to receive(:hex).and_return('password')
    end

    describe '#execute' do
      let(:identifier) { "test_company_#{company.id}" }

      it 'uses client to create sftp entities and updates company' do
        expect(client).to receive(:create_directory).with(identifier)
        expect(client).to receive(:create_user).with(identifier, 'password', identifier)

        expect{ service.execute }.to change{ company.sftp_username }.to(identifier)
          .and change{ company.sftp_password }.to('password')
      end
    end
  end
end
