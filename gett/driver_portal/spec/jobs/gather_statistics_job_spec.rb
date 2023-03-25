require 'rails_helper'

RSpec.describe GatherStatisticsJob, type: :job do
  it 'execute service without error for success case' do
    expect_any_instance_of(Statistics::Gather).to receive(:execute!)
    expect_any_instance_of(Statistics::Gather).to receive(:success?).and_return(true)
    described_class.perform_now
  end

  it 'raise error if service failed' do
    expect_any_instance_of(Statistics::Gather).to receive(:execute!)
    expect_any_instance_of(Statistics::Gather).to receive(:success?).and_return(false)
    expect{ described_class.perform_now }.to raise_error(Statistics::GatherFailed)
  end

  it 'pass yesterday date' do
    expect(Statistics::Gather).to receive(:new)
      .with(system_user, date: '2017-01-01')
      .and_return(instance_double(Statistics::Gather, execute!: true, success?: true))
    Timecop.freeze(Date.parse('2017-01-02')) do
      described_class.perform_now
    end
  end
end
