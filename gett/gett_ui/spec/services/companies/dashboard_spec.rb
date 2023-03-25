require 'rails_helper'

RSpec.describe Companies::Dashboard, type: :service do
  let(:address) { create(:address, line: '123 street', lat: 1, lng: 2) }
  let(:company) { create(:company, name: 'Foo', address_id: address.id, logo: logo) }
  let(:logo)    { Rack::Test::UploadedFile.new(Rails.root.join('spec/fixtures/small_image.gif')) }
  let(:admin)   { create(:admin, company: company) }

  it { is_expected.to be_authorized_by(Companies::DashboardPolicy) }

  before do
    create(:companyadmin, company: company, phone: '+1234567890')
    create(:payment_options, company_id: company.id)
    create(:contact, company_id: company.id, first_name: 'Foo', last_name: 'Bar', phone: '+3213213211', mobile: '+123412341234')
  end

  subject(:service) { Companies::Dashboard.new }

  describe '#execute' do
    service_context { { member: admin, company: company } }

    describe 'result' do
      before do
        create(:booking, :completed, booker: admin, total_cost: 1000)
        create(:booking, :cancelled, booker: admin, total_cost: 2000)
        create(:booking, :rejected, booker: admin, total_cost: 3000)
        create(:booking, :completed, :cash, :customer_care, booker: admin, total_cost: 3000)
        create(:booking, :completed, :cash, :customer_care, booker: admin, total_cost: 500)
        company.reload
        service.execute
      end

      subject { service.result }

      its([:name])            { is_expected.to eq('Foo') }
      its([:logo_url])        { is_expected.to end_with('small_image.gif') }
      its([:address, 'line']) { is_expected.to eq('123 street') }
      its([:contact_person])  { is_expected.to eq('Foo Bar') }
      its([:contact_phone])   { is_expected.to eq('+3213213211') }
      its([:contact_mobile])  { is_expected.to eq('+123412341234') }
      its([:bookings_count])  { is_expected.to eq(3) }
      its([:bookings_sum])    { is_expected.to eq('10') }
    end

    describe 'result[:internal_messages], result[:external_messages]' do
      subject(:result) { service.result }

      before do
        create_list(:message, internal_messages_count, company: company)
        create_list(:message, external_messages_count, :external)
        create_list(:message, deployment_messages_count, :deployment)
      end

      context 'when message limit is 4' do
        before do
          stub_const('Companies::Dashboard::MESSAGES_LIMIT', 4)

          service.execute
        end

        context 'with no messages' do
          let(:internal_messages_count)   { 0 }
          let(:external_messages_count)   { 0 }
          let(:deployment_messages_count) { 0 }

          its([:internal_messages]) { are_expected.to eq([]) }
          its([:external_messages]) { are_expected.to eq([]) }
        end

        context 'with messages' do
          let(:internal_messages_count)   { 3 }
          let(:external_messages_count)   { 2 }
          let(:deployment_messages_count) { 2 }

          it { expect(result[:internal_messages].count).to eq(3) }
          it { expect(result[:external_messages].count).to eq(4) }
        end
      end

      context 'when message limit is 100' do
        before do
          stub_const('Companies::Dashboard::MESSAGES_LIMIT', 100)

          service.execute
        end

        context 'with messages' do
          let(:internal_messages_count)   { 6 }
          let(:external_messages_count)   { 7 }
          let(:deployment_messages_count) { 8 }

          it { expect(result[:internal_messages].count).to eq(6) }
          it { expect(result[:external_messages].count).to eq(15) }
        end
      end
    end

    describe 'result[:can]' do
      before do
        allow_any_instance_of(Companies::DashboardPolicy).to receive(:edit?).and_return(true)
        allow_any_instance_of(Companies::DashboardPolicy).to receive(:send_internal_message?).and_return(true)
        service.execute
      end

      subject { service.result[:can] }

      its([:edit]) { is_expected.to be true }
      its([:send_message]) { is_expected.to be true }
    end

    describe 'result[:chart_data]' do
      before do
        allow(Charts::Index.new(for_dashboard: true)).to receive_message_chain(:execute, :result)
          .and_return(count_by_status_monthly: [], count_by_status_daily: [])
        Timecop.freeze('2017-06-09'.to_date)
        create :booking, :completed, booker: admin, scheduled_at: '2017-06-10'
        create :booking, :completed, :without_passenger, booker: admin, scheduled_at: '2017-06-15'
        Timecop.freeze('2017-06-20'.to_date)
        service.execute
      end

      subject { service.result[:chart_data] }

      it { is_expected.to include(:count_by_status_monthly, :count_by_status_daily) }

      after { Timecop.return }
    end

    describe 'result[:booking_counts]' do
      before do
        create(:booking, :order_received, booker: admin)
        create(:booking, :locating, booker: admin)
        create(:booking, :on_the_way, booker: admin)
        create(:booking, :arrived, booker: admin)
        create(:booking, :in_progress, booker: admin)

        service.execute
      end

      subject { service.result[:booking_counts] }

      its([:live]) { is_expected.to eq(4) }
      its([:future]) { is_expected.to eq(1) }
    end
  end
end
