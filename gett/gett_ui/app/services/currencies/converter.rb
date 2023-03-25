module Currencies
  class Converter < ApplicationService
    # Module converts price amount from one currency to another by applying exchange ratio to the passed amount
    # The :subunits key is used to determine the rounding of the resulting amount:
    #   - in case if amount was defined in subunits (:subunits key should be passed as true) the converted amount will be rounded to integer
    #   - in case if amount was defined in units (:subunits key should be passed as false) it will be rounded to final currency's exponent
    # Exponent value depends on the exact currency and usually equals 2, but there are currencies for which this is not truth
    # i.e. their subunits_to_units ratio does not eq. 100 (e.g. Tunisian dinar, for which subunits_to_units ratio equals 1000)

    attributes :from, :to, :amount, :subunits

    def execute!
      (amount.to_f * exchange_rate).round(round)
    end

    private def exchange_rate
      return 1 unless conversion_possible?

      Rate.new(from: from, to: to).execute.result ||
        fail("Currency rate not found. Unable to convert value from #{from} to #{to}.")
    end

    private def conversion_possible?
      from.present? && to.present? && from != to
    end

    private def round
      subunits ? 0 : Money::Currency.new(to).exponent
    end
  end
end
