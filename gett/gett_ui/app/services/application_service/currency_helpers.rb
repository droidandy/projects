module ApplicationService::CurrencyHelpers
  private def convert_currency_by_country_code(amount:, from: Bookings::DEFAULT_CURRENCY_COUNTRY_CODE, to:, subunits: true)
    convert_currency(amount: amount, from: currency_code(from), to: currency_code(to), subunits: subunits)
  end

  private def convert_currency(amount:, from:, to: Bookings::DEFAULT_CURRENCY, subunits: false)
    Currencies::Converter.new(
      amount: amount,
      from: from,
      to: to,
      subunits: subunits
    ).execute.result
  end

  private def currency_code(country_code)
    currency(country_code).iso_code
  end

  private def currency_symbol(country_code)
    currency(country_code).symbol
  end

  private def currency(country_code)
    iso_country(country_code).currency
  end

  private def iso_country(country_code)
    ISO3166::Country[country_code]
  end
end
