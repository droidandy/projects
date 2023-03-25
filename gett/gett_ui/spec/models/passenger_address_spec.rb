require 'rails_helper'

RSpec.describe PassengerAddress, type: :model do
  describe 'validations' do
    it { is_expected.to validate_presence :address_id }
    it { is_expected.to validate_presence :passenger_id }

    describe ':name presence' do
      context 'when non-favorite type' do
        subject { build :passenger_address, type: 'work' }

        it { is_expected.not_to validate_presence :name }
      end

      context 'when favorite type' do
        subject { build :passenger_address, type: 'favorite' }

        it { is_expected.to validate_presence :name }
      end
    end

    describe ':name uniqueness' do
      let(:passenger) { create :passenger }

      before { create :passenger_address, passenger: passenger, name: 'foo' }

      context 'for the same passenger' do
        subject { build :passenger_address, passenger: passenger, name: 'foo' }

        it { is_expected.not_to be_valid }

        context 'with other type' do
          subject { build :passenger_address, passenger: passenger, name: 'foo', type: 'favorite' }

          it { is_expected.to be_valid }
        end
      end

      context 'for other passenger' do
        subject { build :passenger_address, name: 'foo' }

        it { is_expected.to be_valid }
      end
    end

    describe ':address uniqueness' do
      let(:address)         { create :address }
      let(:other_address)   { create :address }
      let(:passenger)       { create :passenger }
      let(:other_passenger) { create :passenger }

      context 'for home, work addresses' do
        before { create :passenger_address, :home, passenger: passenger, address: address }

        context 'same passenger, same type' do
          subject { build :passenger_address, :home, passenger: passenger, address: address }

          it { is_expected.not_to be_valid }
        end

        context 'same passenger, other type' do
          subject { build :passenger_address, :work, passenger: passenger, address: address }

          it { is_expected.not_to be_valid }
        end

        context 'other passenger, same type, same address' do
          subject { build :passenger_address, :home, passenger: other_passenger, address: address }

          it { is_expected.to be_valid }
        end
      end

      context 'for favourite addresses' do
        subject { build :passenger_address, :favorite, passenger: passenger, address: address }

        context 'when same home/work address exists' do
          before { create :passenger_address, :home, passenger: passenger, address: address }

          it { is_expected.to be_valid }
        end

        context 'when same favorite address exists' do
          before { create :passenger_address, :favorite, passenger: passenger, address: address }

          it { is_expected.not_to be_valid }
        end
      end
    end
  end

  describe 'table constraints' do
    let(:address)         { create :address }
    let(:other_address)   { create :address }
    let(:passenger)       { create :passenger }
    let(:other_passenger) { create :passenger }

    subject { -> { passenger_address.save(validate: false) } }

    describe 'unique index [:passenger_id, :address_id, :type], where: { type: favorite }' do
      before { create :passenger_address, :favorite, passenger: passenger, address: address }

      context 'same passenger, same type, same address' do
        let(:passenger_address) { build :passenger_address, :favorite, passenger: passenger, address: address }

        it { is_expected.to raise_error(Sequel::UniqueConstraintViolation) }
      end

      context 'same passenger, same type, other address' do
        let(:passenger_address) { build :passenger_address, :favorite, passenger: passenger, address: other_address }

        it { is_expected.not_to raise_error }
      end

      context 'same passenger, other type, same address' do
        let(:passenger_address) { build :passenger_address, :work, passenger: passenger, address: address }

        it { is_expected.not_to raise_error }
      end

      context 'other passenger, same type, same address' do
        let(:passenger_address) { build :passenger_address, :favorite, passenger: other_passenger, address: address }

        it { is_expected.not_to raise_error }
      end
    end

    describe 'unique index [:passenger_id, :address_id], where: { type: %w(home work) }' do
      before { create :passenger_address, :home, passenger: passenger, address: address }

      context 'same passenger, other type, same address' do
        let(:passenger_address) { build :passenger_address, :work, passenger: passenger, address: address }

        it { is_expected.to raise_error(Sequel::UniqueConstraintViolation) }
      end

      context 'same passenger, other type, other address' do
        let(:passenger_address) { build :passenger_address, :work, passenger: passenger, address: other_address }

        it { is_expected.not_to raise_error }
      end

      context 'other passenger, same type, same address' do
        let(:passenger_address) { build :passenger_address, :home, passenger: other_passenger, address: address }

        it { is_expected.not_to raise_error }
      end
    end

    describe 'unique index [:passenger_id, :type], where: { type: %w(home work) }' do
      before { create :passenger_address, :home, passenger: passenger, address: address }

      context 'same passenger, same type, other address' do
        let(:passenger_address) { build :passenger_address, :home, passenger: passenger, address: other_address }

        it { is_expected.to raise_error(Sequel::UniqueConstraintViolation) }
      end

      context 'other passenger, same type, same address' do
        let(:passenger_address) { build :passenger_address, :home, passenger: other_passenger, address: address }

        it { is_expected.not_to raise_error }
      end
    end
  end

  describe 'associations' do
    it { is_expected.to have_many_to_one :passenger }
    it { is_expected.to have_many_to_one :address }
  end
end
