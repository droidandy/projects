require 'rails_helper'

RSpec.describe DriversApi::Drivers::Send do
  describe '#execute!' do
    subject { described_class.new(current_user, params) }
    let(:current_user) { create(:user, :with_site_admin_role) }

    let(:user) { create :user }

    let(:params) do
      {
        user: user
      }
    end

    it 'creates new driver' do
      expect(DriversApi::Drivers::Create).to receive(:new)
        .with(current_user, { user: user })
        .and_return(instance_double(DriversApi::Drivers::Create, execute!: true, success?: true, driver_id: 111))
      subject.execute!
    end

    context 'when driver created' do
      before { stub_service(DriversApi::Drivers::Create, driver_id: 111) }

      it 'assign external ID to user' do
        subject.execute!
        expect(subject).to be_success
        expect(user.reload.gett_id).to eq(111)
      end
    end
  end
end
