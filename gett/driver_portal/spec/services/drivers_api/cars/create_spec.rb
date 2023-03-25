require 'rails_helper'

RSpec.describe DriversApi::Cars::Create do
  describe '#execute!' do
    let(:body) { { id: 222 }.to_json }
    let(:current_user) { create :user }

    let(:user) { create :user, gett_id: 111 }
    let(:vehicle) { create :vehicle, user: user }

    let(:params) do
      {
        vehicle: vehicle
      }
    end

    subject { described_class.new(current_user, params) }

    it 'invokes client method' do
      expect_any_instance_of(GettDriversApi::Client).to receive(:create_car)
        .with(
          attributes: {
            license: vehicle.plate_number,
            model: vehicle.model,
            color: vehicle.color,
            active: true,
            env: 'uk'
          }
        )
        .and_return(GenericApiResponse.new(200, body))
      subject.execute!
    end

    context 'when user updated' do
      before { stub_client(GettDriversApi::Client, :create_car, body) }

      it 'returns created driver ID' do
        subject.execute!
        expect(subject).to be_success
        expect(subject.car_id).to eq(222)
      end
    end

    context 'when user update failed' do
      before { stub_client(GettDriversApi::Client, :create_car, { error: 'ERROR' }.to_json, 400) }

      it 'fails' do
        subject.execute!
        expect(subject).not_to be_success
        expect(subject.errors).to eq({ base: 'ERROR' })
      end
    end
  end
end
