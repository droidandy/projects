require 'rails_helper'

RSpec.describe Drivers::Fleet::Parser do
  describe '#as_json' do
    let(:hash) do
      JSON.parse(json_body('gett/fleet_api/drivers'))['results'].first
    end

    subject { described_class.new(hash).parse }

    it 'returns json' do
      expect(subject).to eq(
        account_number:    '24818721',
        address:           '130 Hertford Road, Islington, London N1 4LP',
        badge_number:      'DL_ID',
        city:              'London',
        email:             'markjwilliams30@gmail.com',
        gett_id:           10,
        is_frozen:         false,
        month_acceptance:  77,
        name:              'Mark Williams',
        phone:             '07977 200 039',
        postcode:          'post code',
        rating:            4.93,
        remote_avatar_url: 'https://public.gett.com/IMG/DRIVERS/332793360.jpg',
        sort_code:         '090126',
        today_acceptance:  nil,
        total_acceptance:  42,
        week_acceptance:   0,
        vehicle_colour:    'Black'
      )
    end

    context 'with partial data' do
      let(:hash) { {} }

      it 'should work' do
        expect(subject).to be_present
      end
    end
  end
end
