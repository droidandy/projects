require 'rails_helper'

RSpec.describe BookingDriver do
  it { is_expected.to have_many_to_one :booking }

  describe 'validations' do
    describe 'validate_rating_reasons' do
      subject { build(:booking_driver, rating_reasons: rating_reasons) }

      context 'empty rating reasons' do
        let(:rating_reasons) { [] }

        it { is_expected.to be_valid }
      end

      context 'valid reasons' do
        let(:rating_reasons) { ['app', 'traffic'] }

        it { is_expected.to be_valid }
      end

      context 'invalid reasons' do
        let(:rating_reasons) { ['app', 'traffic', 'invalid_reason'] }

        it { is_expected.not_to be_valid }
      end
    end
  end

  describe '#after_save' do
    let(:driver) { build(:booking_driver, booking: booking) }

    context 'when booking is OT' do
      let(:booking) { create(:booking, :ot) }

      before { allow(booking).to receive(:refresh_indexes) }

      it 'triggers index refresh on update' do
        driver.save
        expect(booking).to have_received(:refresh_indexes)
      end
    end
  end

  describe '#location' do
    subject { driver.location }

    context 'when lat or lng is nil' do
      let(:driver) { build :booking_driver, lat: nil }

      it { is_expected.to be nil }
    end

    context 'when lat and lng is present' do
      let(:driver) { build :booking_driver, lat: 1.0, lng: 2.0 }

      it { is_expected.to eq(lat: 1.0, lng: 2.0) }
    end
  end

  describe '#distance_details' do
    context 'when distance is equal or greated than 1000 feet' do
      let(:driver) { build :booking_driver, distance: 1234 }

      it 'rendered in miles with rounded value' do
        expect(driver.distance_details).to eq(value: 0.2, unit: 'miles')
      end
    end

    context 'when distance is less than 1000 feet' do
      let(:driver) { build :booking_driver, distance: 777 }

      it 'rendered in feet as is' do
        expect(driver.distance_details).to eq(value: 777, unit: 'feet')
      end
    end
  end

  describe '#pickup_distance_mi' do
    subject{ driver.pickup_distance_mi }

    context 'pickup_address present' do
      let(:driver) { build :booking_driver, pickup_distance: '10560' }

      it { is_expected.to eq 2 }
    end

    context 'pickup_address not present' do
      let(:driver) { build :booking_driver, pickup_distance: nil }

      it { is_expected.to eq nil }
    end
  end

  describe '#in_progress_path_points' do
    subject{ driver.in_progress_path_points }

    let(:driver) do
      build(
        :booking_driver,
        path_points: [
          [1, 2],
          [3, 4, 5, true],
          [6, 7, 8, false],
          [9, 0, nil, false]
        ])
    end

    it { is_expected.to eq [[1, 2], [6, 7], [9, 0]] }
  end

  describe '#info_is_blank?' do
    subject { driver.info_is_blank? }

    context 'when name, vehicle and phone_number are blank' do
      let(:driver) { build :booking_driver, name: nil, vehicle: {}, phone_number: nil }

      it { is_expected.to be true }
    end

    context 'when name is present' do
      let(:driver) { build :booking_driver, name: 'Driver', vehicle: {}, phone_number: nil }

      it { is_expected.to be false }
    end

    context 'when phone_number is present' do
      let(:driver) { build :booking_driver, name: nil, vehicle: {}, phone_number: '+380995555555' }

      it { is_expected.to be false }
    end

    context 'when vehicle is present' do
      let(:driver) do
        build :booking_driver,
          vehicle: { color: 'Black', model: 'Mazda 3', license_plate: Faker::Number.number(16) },
          phone_number: nil,
          name: nil
      end

      it { is_expected.to be false }
    end
  end
end
