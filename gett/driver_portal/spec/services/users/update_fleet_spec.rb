require 'rails_helper'

RSpec.describe Users::UpdateFleet do
  let(:body) { json_body('gett/fleet_api/update_driver') }
  let(:error_body) { json_body('gett/fleet_api/error') }
  let(:gett_id) { 11 }
  let(:date) { Time.zone.today }
  let(:birth_date) { Time.zone.today + 1.day }
  let(:password) { '12345678' }
  let(:password_param) { password }

  let(:user) {
    create :user,
           gett_id: gett_id,
           password: password,
           password_confirmation: password,
           account_number: 'Old account number',
           city: nil,
           disability_description: 'disability_description',
           disability_type: 'disability_type',
           driving_cab_since: date - 1.year,
           email: 'old@email.com',
           first_name: 'Old',
           hobbies: 'hobbies',
           last_name: 'Name',
           phone: nil,
           sort_code: 'Old sort code',
           talking_topics: 'talking_topics',
           vehicle_colour: 'Red'
  }
  let(:current_user) { create :user }

  let(:params) do
    {
      user: user,
      account_number: 'New account number',
      address: '123456 Foo Bar',
      birth_date: birth_date,
      city: 'Moscow',
      disability_description: 'new disability_description',
      disability_type: 'new disability_type',
      driving_cab_since: date,
      email: 'email@email.com',
      first_name: 'John',
      hobbies: 'new hobbies',
      last_name: 'Doe',
      phone: '+1234567890',
      postcode: '123456',
      sort_code: 'New sort code',
      talking_topics: 'new talking_topics',
      password: password_param,
      vehicle_colour: 'Black'
    }
  end

  subject { described_class.new(current_user, params) }

  describe '#execute!' do
    it 'sends request with valid data' do
      expect_any_instance_of(GettFleetApi::Client).to receive(:update_driver)
        .with(
          driver_id: gett_id,
          attributes: {
            account_number: 'New account number',
            birthdate: birth_date.to_s,
            email: 'email@email.com',
            name: 'John Doe',
            phone: '+1234567890',
            postal_address: '123456 Foo Bar',
            sort_code: 'New sort code',
            zip: '123456',
            color: 'Black',
            color_en: 'Black'
          }
        )
        .and_return(GettFleetApi::Response.new(200, {}.to_json))
      subject.execute!
    end

    context 'with wrong password' do
      let(:password_param) { 'wrong one' }

      it 'fails without updating user' do
        expect(Users::Update).not_to receive(:new)
        subject.execute!
        expect(subject).not_to be_success
        expect(subject.errors).to eq({ password: 'is wrong' })
      end

      context 'when secure attributes are not changing' do
        let(:params) do
          {
            user: user,
            account_number: 'Old account number',
            sort_code: 'Old sort code',
            password: password_param
          }
        end

        it 'works' do
          stub_client(GettFleetApi::Client, :update_driver, body, response_class: GettFleetApi::Response)
          stub_service(Users::Update, updated_user: user)
          subject.execute!
          expect(subject).to be_success
        end
      end
    end

    context 'when Gett IDs are limited' do
      before(:each) do
        Rails.application.secrets.allowed_gett_id = [1, 2, 3]
        stub_client(GettFleetApi::Client, :update_driver, body, response_class: GettFleetApi::Response)
      end
      after(:each) { Rails.application.secrets.allowed_gett_id = nil }

      context 'when ID is included in list' do
        let(:gett_id) { 2 }

        it 'is successfull' do
          subject.execute!
          expect(subject).to be_success
        end
      end

      context 'when ID is not included in list' do
        let(:gett_id) { 4 }

        it 'is successfull' do
          subject.execute!
          expect(subject).not_to be_success
          expect(subject.errors).to eq ({ base: 'Please use the following Gett IDs: 1, 2, and 3' })
        end
      end
    end

    context 'when external user updated successfully' do
      before(:each) do
        stub_client(GettFleetApi::Client, :update_driver, body, response_class: GettFleetApi::Response)
      end

      it 'is successfull' do
        subject.execute!
        expect(subject).to be_success
      end

      it 'updates local user' do
        expect(Users::Update).to receive(:new)
          .with(
            current_user,
            user: user,
            account_number: 'New account number',
            address: '170041 boo bar',
            birth_date: '2018-01-02',
            city: 'Moscow',
            disability_description: 'new disability_description',
            disability_type: 'new disability_type',
            driving_cab_since: date,
            email: 'anton.macius@gettaxi.com',
            hobbies: 'new hobbies',
            name: 'Ronnie Show 1',
            phone: '123 4567 89',
            postcode: '123456',
            sort_code: 'New sort code',
            talking_topics: 'new talking_topics',
            vehicle_colour: 'Black'
          )
          .and_return(instance_double(Users::Update, execute!: true, success?: true, updated_user: user))
          subject.execute!
      end
    end

    context 'when external user update failed' do
      before(:each) do
        stub_client(GettFleetApi::Client, :update_driver, error_body, 200, response_class: GettFleetApi::Response)
      end

      it 'is failed' do
        subject.execute!
        expect(subject).not_to be_success
        expect(subject.errors).to eq({ base: 'E-mail is invalid' })
      end

      it 'does not touch local user' do
        expect(Users::Update).not_to receive(:new)
        subject.execute!
      end
    end
  end
end
