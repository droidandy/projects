require 'rails_helper'

RSpec.describe DriversApi::Cars::SetCurrent do
  describe '#execute!' do
    let(:current_user) { create :user }

    let(:user) { create :user, gett_id: 111 }
    let(:vehicle) { create :vehicle, user: user, gett_id: 222 }

    let(:params) do
      {
        vehicle: vehicle
      }
    end

    subject { described_class.new(current_user, params) }

    it 'invokes client method' do
      expect_any_instance_of(GettDriversApi::Client).to receive(:update_driver)
        .with(
          driver_id: 111,
          attributes: {
            current_car: {
              id: 222
            }
          }
        )
        .and_return(GenericApiResponse.new(204, nil))
      subject.execute!
    end

    context 'when user updated' do
      before { stub_client(GettDriversApi::Client, :update_driver, nil, 204) }

      it 'works' do
        subject.execute!
        expect(subject).to be_success
      end
    end

    context 'when user update failed' do
      before { stub_client(GettDriversApi::Client, :update_driver, { error: 'ERROR' }.to_json, 400) }

      it 'fails' do
        subject.execute!
        expect(subject).not_to be_success
        expect(subject.errors).to eq({ base: 'ERROR' })
      end
    end
  end
end
