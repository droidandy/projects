module Bookings
  class FetchPaymentCard < ApplicationService
    include ApplicationService::Context

    attributes :passenger, :payment_card_id

    delegate :company, :user, :back_office, to: :context

    def execute!
      return if company.affiliate? || passenger.blank? || payment_card_id.blank?

      dataset = passenger.payment_cards_dataset
      dataset = dataset.where(personal: false) if personal_card_unavailable?
      card = dataset[payment_card_id]
      card unless card&.expired?
    end

    private def personal_card_unavailable?
      # backoffice users always have access to personal credit cards when
      # creating bookings from the backoffice (OTE bookings).
      return false if back_office

      passenger.id != user&.id && !passenger.allow_personal_card_usage?
    end
  end
end
