require 'rails_helper'

RSpec.describe PaymentCard, type: :model do
  describe 'validations' do
    it { is_expected.to validate_presence :passenger_id }
    it { is_expected.to validate_presence :last_4 }
    it { is_expected.to validate_presence :holder_name }
    it { is_expected.to validate_presence :expiration_month }
    it { is_expected.to validate_presence :expiration_year }
    it { is_expected.to validate_presence :card_number }
    it { is_expected.to validate_presence :cvv }
  end

  describe 'associations' do
    it { is_expected.to have_one_to_many :bookings }
    it { is_expected.to have_many_to_one :passenger }
  end

  describe 'token' do
    subject { build(:payment_card, card_number: nil, token: token, last_4: '1234') }

    context 'when valid parameters' do
      let(:token) { 'token123' }

      it { is_expected.to be_valid }
    end

    context 'when invalid parameters' do
      let(:token) { nil }

      it { is_expected.not_to be_valid }
    end
  end

  describe 'last_4' do
    subject { create :payment_card, card_number: '4444333322220 111 ' }

    its(:last_4) { is_expected.to eq('0111') }
  end

  describe 'cvv' do
    subject { build(:payment_card, cvv: cvv, token: nil) }

    context 'when invalid parameters' do
      let(:cvv) { '12345' }

      it { is_expected.not_to be_valid }
    end

    context 'when valid parameters' do
      let(:cvv) { '1234' }

      it { is_expected.to be_valid }
    end
  end

  describe 'kind' do
    subject { create :payment_card, trait }

    context 'when personal' do
      let(:trait) { :personal }

      its(:kind) { is_expected.to eq('Personal') }
    end

    context 'when business' do
      let(:trait) { :business }

      its(:kind) { is_expected.to eq('Business') }
    end
  end

  describe 'title' do
    subject { create :payment_card, card_number: '3333111133331111' }

    its(:title) { is_expected.to eq('Personal payment card ending with 1111') }
  end

  describe 'deactivate!' do
    let(:card) { create :payment_card }

    before { expect(card).to be_active }

    it 'deactivates itself' do
      card.deactivate!
      expect(card).to_not be_active
    end
  end

  describe 'expired?' do
    context 'past year' do
      subject { create :payment_card, expiration_year: Time.current.year - 1 }
      it { is_expected.to be_expired }
    end

    context 'past month' do
      subject { create :payment_card, expiration_year: Time.current.year, expiration_month: Time.current.month - 1 }
      it { is_expected.to be_expired }
    end

    context 'future year' do
      subject { create :payment_card, expiration_year: Time.current.year + 1 }
      it { is_expected.not_to be_expired }
    end
  end
end
