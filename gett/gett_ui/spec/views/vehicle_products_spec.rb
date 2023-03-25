require 'rails_helper'

RSpec.describe :vehicle_products do
  let!(:vehicle1) { create :vehicle, :gett, name: 'spec-taxi', value: 'spec-value-1' }
  let!(:vehicle2) { create :vehicle, :gett, name: 'spec-taxi', value: 'spec-value-2' }

  it 'has proper values' do
    product = DB[:vehicle_products].first(name: 'spec-taxi')

    expect(product[:name]).to eq 'spec-taxi'
    expect(product[:values]).to match_array ['spec-value-1', 'spec-value-2']
    expect(product[:vehicle_ids]).to match_array [vehicle1.id, vehicle2.id]
  end
end
