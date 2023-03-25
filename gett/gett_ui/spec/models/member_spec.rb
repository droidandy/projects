require 'rails_helper'

RSpec.describe Member, type: :model do
  describe 'validations' do
    it { is_expected.to validate_presence(:first_name) }
    it { is_expected.to validate_presence(:last_name) }
    it { is_expected.to validate_presence(:company) }
    it { is_expected.to validate_presence(:role) }
    it { is_expected.to validate_phone_number(:phone) }
    it { is_expected.to validate_includes(Member::PhoneType::ALL, :default_phone_type) }

    describe 'booker_pks validation' do
      let(:passenger) { create(:passenger) }

      subject { build(:booker, booker_pks: [passenger.id]) }

      it { is_expected.not_to be_valid }
    end

    describe 'role validation' do
      subject { build(:finance, company: company) }

      context 'enterprise company' do
        let(:company) { create(:company, :enterprise) }
        it { is_expected.to be_valid }
      end

      context 'affiliate company' do
        let(:company) { create(:company, :affiliate) }
        it { is_expected.not_to be_valid }
      end
    end
  end

  describe 'associations' do
    it { is_expected.to have_many_to_one(:company) }
    it { is_expected.to have_many_to_one(:role) }
    it { is_expected.to have_many_to_many(:passengers) }
    it { is_expected.to have_many_to_many(:bookers) }
    it { is_expected.to have_many_to_one(:department) }
    it { is_expected.to have_many_to_one(:work_role) }
  end

  describe 'subsets' do
    describe 'yet_to_invite' do
      let!(:inactive_passenger)      { create(:passenger, :inactive) }
      let!(:onboarding_passenger)    { create(:passenger, :onboarding) }
      let!(:logged_in_passenger)     { create(:passenger, last_logged_in_at: 2.hours.ago) }
      let!(:yet_to_invite_passenger) { create(:passenger) }

      it 'selects active passengers who have never logged in' do
        expect(Member.yet_to_invite.all).to eq([yet_to_invite_passenger])
      end
    end

    describe 'active, with_active_company' do
      let(:active_company)   { create(:company) }
      let(:inactive_company) { create(:company, :inactive) }
      let!(:member_1)        { create(:member, company: active_company) }
      let!(:member_2)        { create(:member, company: inactive_company) }
      let!(:member_3)        { create(:member, :inactive, company: active_company) }

      describe 'active' do
        it 'selects all active members' do
          expect(Member.active.all.map(&:id)).to match_array([member_1.id, member_2.id])
        end
      end

      describe 'with_active_company' do
        it 'selects all members of active companies' do
          expect(Member.with_active_company.all.map(&:id)).to match_array([member_1.id, member_3.id])
        end

        it "doesn't overwrite member's custom_attributes with company custom_attributes" do
          member = create(:member, company: active_company, pd_type: 'foo')

          expect(Member.with_active_company[member.id].custom_attributes).to eq('pd_type' => 'foo')
        end
      end
    end
  end

  describe '#after_update' do
    let(:company)   { create(:company) }
    let(:passenger) { create(:passenger, company: company, first_name: 'John', last_name: 'Smith') }
    let(:booking)   { create(:booking, company: company, passenger: passenger) }

    it 'updates booking indexes when name changes' do
      expect{ passenger.update(last_name: 'West') }
        .to change{ booking.indexes[:passenger_full_name] }.from('john smith').to('john west')
    end
  end

  describe '#active?' do
    subject(:member) { create(:member, company: company) }

    context 'when company is active' do
      let(:company) { create(:company) }

      it { is_expected.to be_active }
    end

    context 'when company is inactive' do
      let(:company) { create(:company, :inactive) }

      it { is_expected.not_to be_active }
    end
  end

  describe '#executive?' do
    specify { expect(build(:companyadmin)).to be_executive }
    specify { expect(build(:admin)).to be_executive }
    specify { expect(build(:booker)).not_to be_executive }
    specify { expect(build(:passenger)).not_to be_executive }
  end

  describe '#full_name' do
    let(:member) { build(:member, first_name: 'John', last_name: 'Smith') }

    it "returns member's full name" do
      expect(member.full_name).to eq "John Smith"
    end
  end

  describe '#avatar' do
    context 'empty string' do
      let(:member) { build(:member, avatar: '') }

      before { member.save }

      specify { expect(member).to be_persisted }
      specify { expect(member.avatar).to be_blank }
    end

    context 'file' do
      let(:base64_image) { File.read("./spec/fixtures/small_image.gif.urlData") }
      let(:attributes)   { attributes_for(:member, avatar: base64_image) }

      it 'correctly assigns avatar' do
        member = Member.new(attributes).save

        expect(File.binread(member.avatar.file.path)).to eq File.binread("./spec/fixtures/small_image.gif")
      end
    end
  end

  context 'hooks' do
    describe 'before_update' do
      let(:member) { create(:member, onboarding: initial_onboarding) }

      before { member.update(onboarding: new_onboarding) }

      context 'initial onboarding is nil' do
        let(:initial_onboarding) { nil }
        let(:new_onboarding) { true }

        it 'changes onboarding from nil to true' do
          expect(member.reload.onboarding).to eq new_onboarding
        end
      end

      context 'initial onboarding is true' do
        let(:initial_onboarding) { true }
        let(:new_onboarding) { false }

        it 'changes onboarding from true to false' do
          expect(member.reload.onboarding).to eq new_onboarding
        end
      end

      context 'initial onboarding is false' do
        let(:initial_onboarding) { false }
        let(:new_onboarding) { true }

        it 'does not change onboarding from false to true' do
          expect(member.reload.onboarding).to eq initial_onboarding
        end
      end
    end
  end

  describe 'BBC member' do
    let(:company) { create(:company, :bbc) }

    describe '#bbc_freelancer?' do
      subject { build(:passenger, company: company, pd_type: 'freelancer') }

      it { is_expected.to be_bbc_freelancer }
      it { is_expected.not_to be_bbc_staff }
    end

    describe '#bbc_staff?' do
      subject { build(:passenger, company: company, pd_type: 'staff') }

      it { is_expected.not_to be_bbc_freelancer }
      it { is_expected.to be_bbc_staff }
    end

    describe '#bbc_temp?' do
      context 'when pd is not accepted' do
        subject { build(:passenger, :bbc_staff, company: company) }

        it { is_expected.to be_bbc_temp }
      end

      context 'when pd is accepted' do
        subject { build(:passenger, :bbc_staff, company: company, pd_accepted_at: 1.day.ago) }

        it { is_expected.not_to be_bbc_temp }
      end
    end

    describe '#bbc_thin?, #bbc_full?' do
      context 'when not staff' do
        subject { build(:passenger, :bbc_freelancer, company: company) }

        it { is_expected.not_to be_bbc_thin }
        it { is_expected.not_to be_bbc_full }
      end

      context 'when pd is not accepted' do
        subject { build(:passenger, :bbc_staff, company: company) }

        it { is_expected.not_to be_bbc_thin }
        it { is_expected.not_to be_bbc_full }
      end

      context 'when staff and pd accepted and wh_travel flag is off' do
        subject { build(:passenger, :bbc_staff, :pd_accepted, company: company) }

        it { is_expected.to be_bbc_thin }
        it { is_expected.not_to be_bbc_full }
      end

      context 'when staff and pd accepted and wh_travel flag is on' do
        subject { build(:passenger, :bbc_staff, :pd_accepted, company: company, wh_travel: true) }

        it { is_expected.not_to be_bbc_thin }
        it { is_expected.to be_bbc_full }
      end
    end

    describe '#pd_accepted?' do
      context 'when freelancer' do
        subject { build(:passenger, :bbc_freelancer, company: company) }

        its(:pd_accepted?) { is_expected.to be nil }
      end

      context 'when staff with signed pd' do
        subject { build(:passenger, :bbc_staff, company: company, pd_accepted_at: 1.day.ago) }

        its(:pd_accepted?) { is_expected.to be true }
      end

      context 'when staff without signed pd' do
        subject { build(:passenger, :bbc_staff, company: company) }

        its(:pd_accepted?) { is_expected.to be false }
      end
    end

    describe '#pd_eligible?' do
      context 'when pd is not accepted' do
        subject { build(:passenger, :bbc_staff, company: company) }

        its(:pd_eligible?) { is_expected.to be false }
      end

      context 'when pd is not expired' do
        subject(:member) do
          build(:passenger, :bbc_staff, company: company, pd_accepted_at: 1.day.ago)
        end

        its(:pd_eligible?) { is_expected.to be true }
      end

      context 'when pd is expired' do
        subject(:member) do
          build(:passenger, :bbc_staff, :pd_expired, company: company, pd_accepted_at: 1.day.ago)
        end

        its(:pd_eligible?) { is_expected.to be false }
      end
    end

    describe '#pd_expired?' do
      context 'when not expired' do
        subject { build(:passenger, :bbc_staff, company: company, pd_expires_at: 1.day.from_now) }

        its(:pd_expired?) { is_expected.to be false }
      end

      context 'when expired' do
        subject { build(:passenger, :bbc_staff, company: company, pd_expires_at: 2.days.ago) }

        its(:pd_expired?) { is_expected.to be true }
      end
    end

    describe '#mileage_limit' do
      let(:company) { create(:company, :bbc, travel_policy_mileage_limit: 43) }

      subject { build(:passenger, :bbc_staff, company: company, allowed_excess_mileage: '4.5') }

      its(:mileage_limit) { is_expected.to be 47.5 } # 43 + 4.5
    end
  end
end
