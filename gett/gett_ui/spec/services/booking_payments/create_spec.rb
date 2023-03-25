require 'rails_helper'

RSpec.describe BookingPayments::Create, type: :service do
  describe '#execute' do
    subject(:service) { described_class.new(booking: booking) }

    context 'booking type is passenger_payment_card' do
      let(:company)      { create(:company, name: 'PayStub') }
      let(:booker)       { create(:booker, company: company) }
      let(:passenger)    { create(:passenger, company: company, first_name: 'John', last_name: 'Smith') }
      let(:payment_card) { create(:payment_card, :personal, passenger: passenger) }
      let(:booking) do
        create(:booking,
          booker: booker,
          passenger: passenger,
          payment_method: :personal_payment_card,
          total_cost: 2010,
          payment_card_id: payment_card&.id
        )
      end

      before { create(:payment_card, passenger: passenger) }

      describe 'execution result' do
        context 'when payment has not been made before' do
          let(:create_payment_service) { double('Payments::Create') }

          before do
            expect(Payments::Create).to receive(:new).with(
              payment_method_token: payment_card.token,
              order_id: "booking_#{booking.service_id}",
              statement_soft_descriptor: "OT taxi order: #{booking.id}",
              payment_params: {
                booking: booking,
                amount_cents: 2010,
                description: "PayStub: John Smith: #{booking.id}"
              }
            ).and_return(create_payment_service)
            expect(create_payment_service).to receive(:execute).and_return(create_payment_service)
          end

          context 'when Payments::Create executed successfully' do
            before do
              expect(create_payment_service).to receive(:success?).and_return(true)
            end

            it 'executes successfully' do
              expect(service.execute).to be_success
            end

            it 'updates booking "billed" flag' do
              expect{ service.execute }.to change{ booking.reload.billed? }.from(false).to(true)
            end
          end

          context 'when Payments::Create executed unsuccessfully' do
            let(:repeat_payment_service) { double('BookingPayments::Repeat') }

            before do
              expect(create_payment_service).to receive(:success?).and_return(false)
            end

            it 'executes unsuccessfully and repeats a payment' do
              expect(BookingPayments::Repeat).to receive(:new).with(booking: booking)
                .and_return(repeat_payment_service)
              expect(repeat_payment_service).to receive(:execute)

              expect(service.execute).to_not be_success
            end

            it 'does not update booking "billed" flag' do
              expect{ service.execute }.not_to change{ booking.reload.billed? }
            end
          end
        end

        context 'when booking is already billed' do
          before { booking.update(billed: true) }

          it 'does not call Payments::Create' do
            expect(Payments::Create).to_not receive(:new)

            service.execute
          end
        end

        context 'when payment already present' do
          before { create(:payment, :captured, booking: booking) }

          it 'does not call Payments::Create' do
            expect(Payments::Create).to_not receive(:new)

            service.execute
          end
        end

        context 'when company has periodic payment type' do
          let(:company) { create(:company, payment_types: ['passenger_payment_card_periodic']) }

          it 'does not call Payments::Create' do
            expect(Payments::Create).to_not receive(:new)

            service.execute
          end
        end

        context 'when booking has zero price' do
          let(:booking) do
            create(:booking,
              booker: booker,
              passenger: passenger,
              payment_method: :personal_payment_card,
              total_cost: 0,
              payment_card_id: payment_card&.id
            )
          end

          it 'does not call Payments::Create' do
            expect(Payments::Create).to_not receive(:new)

            service.execute
          end
        end
      end
    end
  end
end
