using Sequel::CoreRefinements

module Invoices
  class Create < ApplicationService
    include ApplicationService::ModelMethods

    attributes :company, :custom_billing_period

    delegate :invoicing_schedule, to: :company, prefix: true

    BILLING_PERIODS = {
      'weekly' => lambda do
        week_ago = 1.week.ago.in_time_zone(Settings.time_zone)
        week_ago.beginning_of_week..week_ago.end_of_week
      end,
      'monthly' => lambda do
        month_ago = 1.month.ago.in_time_zone(Settings.time_zone)
        month_ago.beginning_of_month..month_ago.end_of_month
      end
    }.freeze

    def execute!
      if company.with_periodic_payment_type?
        create_cc_invoices
      else
        create_regular_invoice
      end
    end

    private def create_regular_invoice
      Invoices::CreateForCompany.new(company: company, billing_period: billing_period).execute.result
    end

    private def create_cc_invoices
      passengers =
        company.passengers_dataset
          .select_all(:users)
          .join(:bookings, passenger_id: :users[:id])
          .where(:bookings[:scheduled_at] => billing_period, :bookings[:status] => Booking::FINAL_STATUSES)
          .order(Sequel.asc(:users[:id]))
          .distinct(:users[:id])
          .all

      passengers.map do |passenger|
        Invoices::CreateForPassenger.new(passenger: passenger, billing_period: billing_period).execute.result
      end
    end

    private def billing_period
      @billing_period ||=
        custom_billing_period || BILLING_PERIODS[company_invoicing_schedule].call
    end
  end
end
