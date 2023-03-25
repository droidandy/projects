require 'rails_helper'

RSpec.describe Drivers::Parser do
  describe '#as_json' do
    let(:hash) do
      JSON.parse(json_body('gett/finance_portal_api/drivers')).first
    end

    subject { described_class.new(hash).parse }

    it 'returns json' do
      expect(subject).to eq(
        account_number:    "54577055",
        address:           "10 College Cottages, College Avenue",
        badge_number:      "BDG-10042",
        badge_type:        "yellow",
        city:              "Maidstone",
        email:             "gavin.john3@sky.com",
        gett_id:           "10042",
        is_frozen:         false,
        name:              "Gavin Payne",
        phone:             "07946893106",
        postcode:          "ME15 6YJ",
        remote_avatar_url: 'photo.com/gavin_face.jpg',
        sort_code:         "606008"
      )
    end
  end
end
