require 'rails_helper'

RSpec.describe DriversApi::Drivers::Update do
  describe '#execute!' do
    let(:current_user) { create :user }

    let(:user) { create :user, gett_id: 111 }

    let(:params) do
      {
        user: user
      }
    end

    subject { described_class.new(current_user, params) }

    it 'invokes client method' do
      expect_any_instance_of(GettDriversApi::Client).to receive(:update_driver)
        .with(
          driver_id: user.gett_id,
          attributes: {
            account_number:            user.account_number,
            birthdate:                 user.birth_date,
            city:                      user.city,
            display_name:              user.name,
            driver_license_id:         user.badge_number,
            email:                     user.email,
            hobby:                     user.hobbies,
            is_frozen:                 user.is_frozen,
            license_no:                user.license_number,
            name:                      user.name,
            national_insurance_number: user.insurance_number,
            phone:                     user.phone,
            phone2:                    user.phone,
            postal_address:            user.address,
            sort_code:                 user.sort_code,
            zip:                       user.postcode
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
