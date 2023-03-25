require 'rails_helper'

RSpec.describe Users::Update do
  describe '#execute!' do
    let(:current_user) { create :user }
    let(:user) { create :user }
    let(:date) { Time.zone.today }
    let(:birth_date) { Time.zone.today + 1.day }
    subject { described_class.new(current_user, params) }

    before(:each) do
      subject.execute!
    end

    context 'with all params' do
      let(:params) do
        {
          user: user,
          email: 'new@email.com',
          password: 'password',
          password_confirmation: 'password',
          account_number: 'account_number',
          active: false,
          address: 'address',
          badge_number: 'badge_number',
          badge_type: 'badge_type',
          birth_date: birth_date,
          city: 'city',
          gett_id: 1,
          is_frozen: true,
          license_number: 'license_number',
          name: 'First Last',
          phone: 'phone',
          postcode: 'postcode',
          sort_code: 'sort_code',
          hobbies: 'hobbies',
          talking_topics: 'talking_topics',
          driving_cab_since: date,
          disability_type: 'disability_type',
          disability_description: 'disability_description',
          vehicle_colour: 'Black'
        }
      end

      it 'should work' do
        subject.execute!
        expect(subject).to be_success
      end

      it 'should update user' do
        subject.execute!
        updated_user = subject.user.reload
        expect(updated_user.email).to eq params[:email]
        expect(updated_user.password).to eq params[:password]
        expect(updated_user.password_confirmation).to eq params[:password_confirmation]
        expect(updated_user.account_number).to eq params[:account_number]
        expect(updated_user.address).to eq params[:address]
        expect(updated_user.badge_number).to eq params[:badge_number]
        expect(updated_user.badge_type).to eq params[:badge_type]
        expect(updated_user.birth_date).to eq params[:birth_date]
        expect(updated_user.city).to eq params[:city]
        expect(updated_user.first_name).to eq 'First'
        expect(updated_user.gett_id).to eq params[:gett_id]
        expect(updated_user.is_frozen).to eq params[:is_frozen]
        expect(updated_user.last_name).to eq 'Last'
        expect(updated_user.license_number).to eq params[:license_number]
        expect(updated_user.phone).to eq params[:phone]
        expect(updated_user.postcode).to eq params[:postcode]
        expect(updated_user.sort_code).to eq params[:sort_code]
        expect(updated_user.hobbies).to eq params[:hobbies]
        expect(updated_user.talking_topics).to eq params[:talking_topics]
        expect(updated_user.driving_cab_since).to eq params[:driving_cab_since]
        expect(updated_user.disability_type).to eq params[:disability_type]
        expect(updated_user.disability_description).to eq params[:disability_description]
        expect(updated_user.vehicle_colour).to eq params[:vehicle_colour]
      end

      it 'should set PaperTrail whodunnit' do
        subject.execute!
        expect(subject.user.versions.last.whodunnit).to eq("#{current_user.id} - #{current_user.name}")
      end
    end

    context 'with role filled' do
      let(:params) do
        {
          user: user,
          role: 'site_admin'
        }
      end

      it 'add role' do
        expect(subject.updated_user.roles_name).to eq(['site_admin'])
      end

      context 'when user already has role' do
        let(:user) { create :user, :with_community_manager_role }

        it 'old role should be substituted' do
          expect(subject.updated_user.roles_name).to eq(['site_admin'])
        end
      end
    end
  end
end
