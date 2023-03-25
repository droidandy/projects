require 'rails_helper'

RSpec.describe DriversApi::Cars::Assign do
  describe '#execute!' do
    let(:current_user) { create :user }

    let(:user) { create :user, gett_id: 111 }
    let(:vehicle) { create :vehicle, user: user, gett_id: 222, title: 'Title' }

    let(:params) do
      {
        vehicle: vehicle
      }
    end

    subject { described_class.new(current_user, params) }

    it 'invokes client method' do
      expect_any_instance_of(GettDriversApi::Client).to receive(:assign_car)
        .with(
          driver_id: 111,
          car_id: 222,
          title: 'Title'
        )
        .and_return(GenericApiResponse.new(204, nil))
      subject.execute!
    end

    context 'when car assigned updated' do
      before { stub_client(GettDriversApi::Client, :assign_car, nil, 204) }

      it 'works' do
        subject.execute!
        expect(subject).to be_success
      end
    end

    context 'when car assignment failed' do
      before { stub_client(GettDriversApi::Client, :assign_car, { error: 'ERROR' }.to_json, 400) }

      it 'fails' do
        subject.execute!
        expect(subject).not_to be_success
        expect(subject.errors).to eq({ base: 'ERROR' })
      end
    end
  end
end
