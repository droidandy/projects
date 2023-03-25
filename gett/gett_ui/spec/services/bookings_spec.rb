require 'rails_helper'

RSpec.describe Bookings do
  describe '.service_for' do
    subject(:service_result) { described_class.service_for(booking, operation_type) }

    context 'when Gett booking' do
      let(:booking) { build(:booking, :gett) }

      context 'operation create' do
        let(:operation_type) { :create }

        it { expect(service_result).to be_an_instance_of(Gett::Create) }
        it { expect(service_result.booking).to eq(booking) }
      end

      context 'operation modify' do
        let(:operation_type) { :modify }

        it { expect(service_result).to be_an_instance_of(Gett::Modify) }
        it { expect(service_result.booking).to eq(booking) }
      end

      context 'operation cancel' do
        let(:operation_type) { :cancel }

        it { expect(service_result).to be_an_instance_of(Gett::Cancel) }
        it { expect(service_result.booking).to eq(booking) }
      end
    end

    context 'when OT booking' do
      let(:booking) { build(:booking, :ot) }

      context 'operation create' do
        let(:operation_type) { :create }

        it { expect(service_result).to be_an_instance_of(OneTransport::Create) }
        it { expect(service_result.booking).to eq(booking) }
      end

      context 'operation modify' do
        let(:operation_type) { :modify }

        it { expect(service_result).to be_an_instance_of(OneTransport::Modify) }
        it { expect(service_result.booking).to eq(booking) }
      end

      context 'operation cancel' do
        let(:operation_type) { :cancel }

        it { expect(service_result).to be_an_instance_of(OneTransport::Cancel) }
        it { expect(service_result.booking).to eq(booking) }
      end
    end

    context 'when GetE booking' do
      let(:booking) { build(:booking, :get_e) }

      context 'operation create' do
        let(:operation_type) { :create }

        it { expect(service_result).to be_an_instance_of(GetE::Create) }
        it { expect(service_result.booking).to eq(booking) }
      end

      context 'operation modify' do
        let(:operation_type) { :modify }

        it { expect(service_result).to be_an_instance_of(GetE::Modify) }
        it { expect(service_result.booking).to eq(booking) }
      end

      context 'operation cancel' do
        let(:operation_type) { :cancel }

        it { expect(service_result).to be_an_instance_of(GetE::Cancel) }
        it { expect(service_result.booking).to eq(booking) }
      end
    end

    context 'when Manual booking' do
      let(:booking) { build(:booking, :manual) }

      context 'operation create' do
        let(:operation_type) { :create }

        it { expect(service_result).to be_an_instance_of(Manual::Create) }
        it { expect(service_result.booking).to eq(booking) }
      end

      context 'operation modify' do
        let(:operation_type) { :modify }

        it { expect(service_result).to be_an_instance_of(Manual::Modify) }
        it { expect(service_result.booking).to eq(booking) }
      end

      context 'operation cancel' do
        let(:operation_type) { :cancel }

        it { expect(service_result).to be_an_instance_of(Manual::Cancel) }
        it { expect(service_result.booking).to eq(booking) }
      end
    end
  end

  describe '.updater_for' do
    subject { described_class.updater_for(booking) }

    context 'when Gett booking' do
      let(:booking) { create(:booking, :gett) }
      context 'when service cannot be executed' do
        before do
          expect_any_instance_of(Bookings::Updaters::Gett).to receive(:can_execute?)
            .and_return(false)
        end
        it { is_expected.to be_nil }
      end

      context 'when service can be executed' do
        before do
          expect_any_instance_of(Bookings::Updaters::Gett).to receive(:can_execute?)
            .and_return(true)
        end
        it { is_expected.to be_an_instance_of Bookings::Updaters::Gett }
      end
    end

    context 'when OT booking' do
      let(:booking) { create(:booking, :ot) }

      context 'when service cannot be executed' do
        before do
          expect_any_instance_of(Bookings::Updaters::OT).to receive(:can_execute?)
            .and_return(false)
        end
        it { is_expected.to be_nil }
      end

      context 'when service can be executed' do
        before do
          expect_any_instance_of(Bookings::Updaters::OT).to receive(:can_execute?)
            .and_return(true)
        end
        it { is_expected.to be_an_instance_of Bookings::Updaters::OT }
      end
    end

    context 'when Splyt booking' do
      let(:booking) { create(:booking, :splyt) }

      context 'when service cannot be executed' do
        before do
          expect_any_instance_of(Bookings::Updaters::Splyt).to receive(:can_execute?).and_return(false)
        end

        it { is_expected.to be_nil }
      end

      context 'when service can be executed' do
        before do
          expect_any_instance_of(Bookings::Updaters::Splyt).to receive(:can_execute?).and_return(true)
        end

        it { is_expected.to be_an_instance_of(Bookings::Updaters::Splyt) }
      end
    end
  end
end
