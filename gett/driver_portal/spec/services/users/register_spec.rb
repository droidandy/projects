require 'rails_helper'

RSpec.describe Users::Register do
  before { create(:user, :system) }

  describe '#execute!' do
    subject { described_class.new(params) }

    let(:params) do
      {
        email: 'm@il.com',
        first_name: 'John',
        last_name: 'Doe',
        phone: '+41 123 456 789',
        license_number: '112233',
        how_did_you_hear_about: 'ads'
      }
    end

    it 'passes valid params' do
      expect(SecureRandom).to receive(:hex).and_return('Password')
      expect(Users::Create).to receive(:new).with(
        system_user,
        {
          email: 'm@il.com',
          name: 'John Doe',
          password: 'Password',
          password_confirmation: 'Password',
          active: true,
          role: 'apollo_driver',
          phone: '+41 123 456 789',
          license_number: '112233',
          how_did_you_hear_about: 'ads',
          onboarding_step: 1
        }
      ).and_return(instance_double(
        Users::Create,
        execute!: true,
        success?: true,
        user: create(:user, :with_driver_role)
      ))
      subject.execute!
      expect(subject).to be_success
    end

    it 'invokes vehicle creation' do
      user = create(:user, :with_driver_role)
      stub_service(Users::Create, user: user)
      expect(Vehicles::Create).to receive(:new)
        .with(user, { title: 'Vehicle 1' })
        .and_return(instance_double(Vehicles::Create, execute!: true, success?: true, vehicle: create(:vehicle)))
      subject.execute!
      expect(subject).to be_success
    end

    context 'with invalid params' do
      it 'returns erros' do
        stub_service(Users::Create, false, user: nil, errors: { a: :b })
        subject.execute!
        expect(subject).not_to be_success
        expect(subject.errors).to eq({ a: :b })
      end
    end
  end
end
