require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'validations' do
    it { is_expected.to validate_presence :email }
    it { is_expected.to validate_unique :email }
    it { is_expected.to validate_email :email }
    it { is_expected.to validate_max_length(30, :first_name) }
    it { is_expected.to validate_max_length(30, :last_name) }
    it { is_expected.to validate_format(Sequel::Plugins::ApplicationModel::USER_NAME_FORMAT, :first_name) }
    it { is_expected.to validate_format(Sequel::Plugins::ApplicationModel::USER_NAME_FORMAT, :last_name) }

    it 'validates uniqueness of email without case sensitivity' do
      create(:user, email: 'x@mail.com')
      expect(build(:user, email: 'X@mail.com')).to_not be_valid
    end

    it 'validate format of name' do
      expect(build(:user, first_name: 'Johns')).to be_valid
      expect(build(:user, first_name: 'Johns[')).to_not be_valid
    end

    context 'when first and last name are nil' do
      let(:user) { build(:user, first_name: nil, last_name: nil) }

      subject { user.errors }

      before { user.valid? }

      describe 'errors are not duplicated' do
        its([:first_name]) { is_expected.to eq ["is not present"] }
        its([:last_name]) { is_expected.to eq ["is not present"] }
      end
    end
  end

  describe 'associations' do
    it { is_expected.to have_many_to_one :user_role }
    it { is_expected.to have_one_to_many :messages }
    it { is_expected.to have_one_to_one :api_key }
  end

  describe '.active' do
    let(:company)          { create :company }
    let(:inactive_company) { create :company, active: false }
    let!(:user)            { create :user }
    let!(:member)          { create :member, company: company }

    before do
      create :member, company: company, active: false
      create :member, company: inactive_company
    end

    subject { User.active.all }

    it { is_expected.to match_array [user, member] }
  end

  describe '.create' do
    it 'generates random password' do
      user = User.create(
        email:      'mail@example.com',
        first_name: 'Admin',
        last_name:  'Super'
      )
      expect(user.password_digest).to be_present
    end
  end

  describe '#valid_password?' do
    let(:user) { create :user, password: '123123123', password_confirmation: '123123123' }

    specify 'when password is valid' do
      expect(user.valid_password?('123123123')).to be true
    end

    specify 'when password is invalid' do
      expect(user.valid_password?('1111111')).to be false
    end
  end

  describe '#realm' do
    subject { user.realm }

    context 'when user is super admin' do
      let(:user) { create :user }

      it { is_expected.to eq 'admin' }
    end

    context 'when user is of enterprise company' do
      let(:user) { create :member }

      it { is_expected.to eq 'app' }
    end

    context 'when user is of affiliate company' do
      let(:company) { create :company, :affiliate }
      let(:user) { create :member, company: company }

      it { is_expected.to eq 'affiliate' }
    end
  end

  describe '#realms' do
    subject { user.realms }

    context 'when user is back office user only' do
      let(:user) { create :user, :admin }

      it { is_expected.to eq ['admin'] }
    end

    context 'when user is of enterprise company' do
      let(:user) { create :member, :admin, user_role_id: Role[:admin].id }

      it { is_expected.to eq ['admin', 'app'] }
    end

    context 'when user is of affiliate company' do
      let(:company) { create :company, :affiliate }
      let(:user) { create :member, :admin, company: company, user_role_id: Role[:admin].id }

      it { is_expected.to eq ['admin', 'affiliate'] }
    end
  end

  describe '#superadmin?' do
    subject { user.superadmin? }

    context 'when user is super admin' do
      let(:user) { create :user, :superadmin }

      it { is_expected.to be true }
    end
  end

  describe '#avatar_versions' do
    subject { create(:user).avatar_versions }

    its(:keys) { is_expected.to match_array %i(px150 px420) }
  end
end
