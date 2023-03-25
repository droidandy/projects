using Sequel::CoreRefinements

class Companies::Dashboard < ApplicationService
  include ApplicationService::Policy
  include ApplicationService::Context

  delegate :company, :member, to: :context

  MESSAGES_LIMIT = 50

  def execute!
    {
      name:              company.name,
      logo_url:          company.logo&.url,
      address:           company.address&.as_json(only: [:line, :lat, :lng, :country_code]),
      contact_person:    company.primary_contact&.full_name,
      contact_phone:     company.primary_contact&.phone,
      contact_mobile:    company.primary_contact&.mobile,
      bookings_count:    bookings_dataset.count,
      bookings_sum:      bookings_sum,
      internal_messages: internal_messages,
      external_messages: external_and_deployment_messages,
      can: {
        edit: policy.edit?,
        send_message: policy.send_internal_message?
      },
      chart_data: Charts::Index.new(for_dashboard: true, bookings_scope: policy_scope(:bookings)).execute.result,
      booking_counts: {
        live: bookings_dataset.live.count,
        future: bookings_dataset.future.count
      }
    }
  end

  private def bookings_dataset
    @bookings_dataset ||= policy_scope(:bookings).not_customer_care
  end

  private def completed_orders
    bookings_dataset.completed
      .where{ created_at >= Date.current - DAYS_RANGE.days }
      .order{ date(:scheduled_at) }
      .group_and_count{ date(:scheduled_at).as(:date) }
      .from_self(alias: :counts)
      .select(:to_char.sql_function(:date, 'MM/DD').as(:date), :count.as(:orders))
      .to_hash(:date, :orders)
  end

  private def bookings_sum
    total = policy_scope(:bookings).completed
      .left_join(:booking_charges, booking_id: :bookings[:id])
      .select(:bookings.*, :booking_charges[:total_cost])
      .sum(:total_cost).to_i / 100
    ActionController::Base.helpers.number_to_human(total,
      format: '%n%u',
      units:  {thousand: 'k', million: 'M', billion: 'B'}
    )
  end

  private def internal_messages
    internal_messages_dataset.all.map do |message|
      Messages::Show.new(message: message).execute.result
    end
  end

  private def external_and_deployment_messages
    Message.external_and_deployment.reverse(:created_at).limit(MESSAGES_LIMIT).map do |message|
      Messages::Show.new(message: message).execute.result
    end
  end

  private def internal_messages_dataset
    company.internal_messages_dataset
      .reverse(:created_at).limit(MESSAGES_LIMIT).eager(:sender)
  end
end
