require 'rails_helper'

RSpec.describe Splyt::Update do
  subject(:service) { described_class.new(booking: booking) }

  let(:booking) { create(:booking, :splyt) }

  describe '#execute' do
    let(:result) { double(success: true) }

    before do
      allow(service).to receive(:normalized_response).and_return({})
      expect_any_instance_of(::Splyt::DriverInfo).to receive(:execute!).and_return(result)
      expect_any_instance_of(::Splyt::BookingInfo).to receive(:execute!).and_return(result)
    end

    it 'involves two api services' do
      expect(service.execute.success?).to be_truthy
    end
  end
end
