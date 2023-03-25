require 'rails_helper'

RSpec.describe SyncDriversJob, type: :job do
  it 'execute service without error for success case' do
    expect_any_instance_of(System::SyncDrivers::All).to receive(:execute!)
    expect_any_instance_of(System::SyncDrivers::All).to receive(:success?).and_return(true)
    described_class.perform_now
  end

  it 'raise error if finance portal service failed' do
    stub_service(System::SyncDrivers::All, false)
    expect{ described_class.perform_now }.to raise_error(Drivers::SyncError)
  end
end
