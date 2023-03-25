module Bookings
  class FetchPaymentTypes < ApplicationService
    include ApplicationService::Context

    PASSENGER_PAYMENT_CARD_TYPES = %w'passenger_payment_card passenger_payment_card_periodic'.freeze

    attributes :company, :passenger, :vehicle_name, :allow_personal_cards

    delegate :member, to: :context

    def execute!
      result do
        company.payment_types.flat_map do |type|
          if PASSENGER_PAYMENT_CARD_TYPES.include?(type)
            passenger_payment_cards.map(&method(:card_to_payment_type_option))
          else
            next if vehicle_name.present? && type == 'cash' && !::Bookings::CASH_VEHICLES.include?(vehicle_name)

            with_default_flag(payment_method: type, value: type, label: I18n.t("payment_types.#{type}"))
          end
        end
      end

      result.compact!
    end

    def default_payment_type
      type = result.find{ |opt| opt[:default] } || result.first

      type.presence && type[:value]
    end

    private def card_to_payment_type_option(card)
      payment_method = "#{card.type}_payment_card"
      payment_type   = "#{payment_method}:#{card.id}"

      with_default_flag(
        payment_method: payment_method,
        payment_card_id: card.id,
        value: payment_type,
        label: card.title
      )
    end

    private def with_default_flag(option)
      if PASSENGER_PAYMENT_CARD_TYPES.include?(default_company_payment_type)
        option.merge(default: option.key?(:payment_card_id) && option[:payment_card_id] == default_passenger_payment_card&.id)
      else
        option.merge(default: option[:payment_method] == default_company_payment_type)
      end
    end

    private def default_passenger_payment_card
      return @default_passenger_payment_card if defined?(@default_passenger_payment_card)

      @default_passenger_payment_card = passenger_payment_cards.find(&:default?) || passenger_payment_cards.first
    end

    private def default_company_payment_type
      company.payment_options.default_payment_type
    end

    private def passenger_payment_cards
      return [] if passenger.blank?

      passenger.payment_cards
        .select do |card|
          allow_personal_cards? || member&.id == passenger.id ||
            card.business? || passenger.allow_personal_card_usage?
        end
        .reject(&:expired?)
    end
  end
end
