using Sequel::CoreRefinements

class Receipts::Notifier < ApplicationService
  def execute
    Receipts::S3ZipBunch.cleanup_old_receipts!

    passengers.each do |passenger|
      public_zip_path = Receipts::S3ZipBunch.new(
        passenger: passenger,
        bookings: public_passenger_bookings(passenger)
      ).execute.result

      private_zip_path = Receipts::S3ZipBunch.new(
        passenger: passenger,
        bookings: private_passenger_bookings(passenger)
      ).execute.result

      params = {
        from_date: I18n.l(from_date, format: :invoice_overdue),
        to_date:   I18n.l(to_date, format: :invoice_overdue)
      }

      ReceiptsMailer.receipts_for_passenger(
        passenger, params.merge(zip_path: private_zip_path)
      ).deliver_later(wait_until: deliver_at)

      next if public_zip_path.nil?

      passenger.bookers.each do |booker|
        ReceiptsMailer.receipts_for_booker(
          booker, passenger, params.merge(zip_path: public_zip_path)
        ).deliver_later(wait_until: deliver_at)
      end
    end
  end

  private def passenger_bookings(passenger)
    passenger.bookings_dataset
      .credit
      .association_join(:payments)
      .where(:bookings[:status] => 'completed', :bookings[:ended_at] => period)
      .where(:payments[:status] => Payment.config.success_statuses)
      .distinct(:bookings[:id])
      .select(:bookings.*)
  end

  private def public_passenger_bookings(passenger)
    passenger_bookings(passenger).where do |r|
      (r.booker_id !~ passenger.id) |
        (r.payment_method !~ PaymentOptions::PaymentType::PERSONAL_PAYMENT_CARD)
    end.all
  end

  private def private_passenger_bookings(passenger)
    passenger_bookings(passenger).all
  end

  private def passengers
    @passengers ||= Member
      .select_all(:users)
      .join(:companies, id: :company_id)
      .join(:bookings, passenger_id: :users[:id])
      .join(:payments, booking_id: :bookings[:id])
      .where(
        :companies[:company_type] => Company::Type::ENTERPRISE,
        :bookings[:status] => 'completed',
        :bookings[:ended_at] => period,
        :bookings[:payment_method] => ['personal_payment_card', 'business_payment_card'],
        :payments[:status] => Payment.config.success_statuses
      )
      .distinct
      .all
  end

  private def from_date
    @from_date ||= week_ago.beginning_of_week
  end

  private def to_date
    @to_date ||= week_ago.end_of_week
  end

  private def week_ago
    @week_ago ||= 1.week.ago.in_time_zone(Settings.time_zone)
  end

  private def period
    @period ||= from_date..to_date
  end

  private def deliver_at
    datetime = to_date + 6.hours
    datetime.past? ? nil : datetime
  end
end
