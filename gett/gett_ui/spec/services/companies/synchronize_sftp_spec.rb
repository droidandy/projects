require 'rails_helper'

RSpec.describe Companies::SynchronizeSftp, type: :service do
  it { is_expected.to be_authorized_by(Companies::SynchronizeSftpPolicy) }

  describe '#execute' do
    let(:company)     { create :company }
    subject(:service) { Companies::SynchronizeSftp.new }

    service_context { { company: company } }

    describe 'execution results' do
      before do
        expect(::SftpWorker).to receive(:perform_async).with(company.id).and_return(true)

        service.execute
      end

      it { is_expected.to be_success }
    end
  end
end
