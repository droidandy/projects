require 'rails_helper'

RSpec.describe Feedbacks::Create, type: :service do
  let(:booking) { create(:booking) }
  let(:feedback_params) { {rating: 5, message: 'Awesome service!'} }
  let(:service) { described_class.new(booking: booking, params: feedback_params) }

  service_context { { member: booking.booker, company: booking.booker.company } }

  it 'creates a feedback' do
    expect{ service.execute }.to change{ Feedback.count }.by(1)
    expect(Feedback.last.booking).to eq(booking)
  end

  it 'send feedback mail' do
    expect{ service.execute }.to change(FeedbacksMailer.deliveries, :size).by(1)
  end

  context 'invalid feedback params' do
    let(:feedback_params) { {} }

    it 'executes unsuccessfully' do
      expect(service.execute).to_not be_success
    end

    it 'provides errors' do
      service.execute
      expect(service.errors).to be_present
    end
  end
end
