require 'rails_helper'

RSpec.describe Drivers::Fleet::Metrics do
  describe '#execute!' do
    let(:driver) do
      {
        id: 10
      }
    end
    let(:user) { create :user, :with_driver_role, gett_id: 1 }
    let(:current_user) { create(:user, :with_site_admin_role) }

    let(:params) do
      {
        user_id: user.id
      }
    end

    subject { described_class.new(current_user, params) }

    context 'with valid params' do
      it 'runs successfully' do
        stub_service(Drivers::Fleet::One, driver: driver)
        subject.execute!
        expect(subject).to be_success
      end

      it 'pass valid params' do
        expect(Drivers::Fleet::One).to receive(:new).
          with(
            current_user,
            driver_id: 1,
            fields: %i[statistics computed_rating]
          )
          .and_return(instance_double(Drivers::Fleet::One, execute!: true, success?: true, driver: driver))
        subject.execute!
      end

      it 'returns driver' do
        stub_service(Drivers::Fleet::One, driver: driver)
        subject.execute!
        expect(subject.driver_data).to eq({ id: 10 })
      end
    end

    context 'with invalid response' do
      before(:each) do
        stub_service(Drivers::Fleet::One, false, driver: nil, errors: { error: :error })
      end

      it 'fails' do
        subject.execute!
        expect(subject).not_to be_success
        expect(subject.driver_data).to be_nil
        expect(subject.errors).to eq({ error: :error })
      end
    end

    context 'with invalid user_id' do
      let(:params) do
        {
          user_id: 0
        }
      end

      it 'fails' do
        subject.execute!
        expect(subject).not_to be_success
        expect(subject.driver_data).to be_nil
        expect(subject.errors).to eq({ user: 'not found' })
      end
    end
  end
end
