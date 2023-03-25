require 'rails_helper'

RSpec.describe Drivers::Fleet::UpdateParser do
  describe '#as_json' do
    let(:hash) do
      JSON.parse(json_body('gett/fleet_api/update_driver'))['result']
    end

    subject { described_class.new(hash).parse }

    it 'returns json' do
      expect(subject).to eq(
        account_number: 'New account number',
        address:        '170041 boo bar',
        birth_date:     '2018-01-02',
        email:          'anton.macius@gettaxi.com',
        name:           'Ronnie Show 1',
        phone:          '123 4567 89',
        postcode:       '123456',
        sort_code:      'New sort code',
        vehicle_colour: 'Black'
      )
    end
  end
end
