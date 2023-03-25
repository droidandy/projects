require "rails_helper"

describe "rake notifications:deploy", type: :task do
  let!(:notification) { create(:deployment_notification) }
  before { allow_any_instance_of(ActiveJob::ConfiguredJob).to receive(:perform_later).with(an_instance_of(Message)) }

  it "preloads the Rails environment" do
    expect(task.prerequisites).to include "environment"
  end

  it "runs gracefully with no subscribers" do
    expect{ task.execute }.not_to raise_error
  end

  it 'creates new Message' do
    expect{ task.execute }.to change(Message, :count).by(1)
  end

  it 'sends message with correct body' do
    task.execute
    message = Message.last
    expect(message.body).to include('Deployment notification')
    expect(message.body).not_to include('{deployment_time}')
  end
end
