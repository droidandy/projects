require 'location_client'

describe LocationClient do
  subject { described_class.new(4) }

  it 'returns drivers locations' do
    result = subject.locations
    expect(result).to be_a(Hash)
  end
end
