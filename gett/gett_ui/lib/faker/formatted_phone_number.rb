module Faker::FormattedPhoneNumber
  def phone_number(format = nil)
    fake_number = format.present? ? parse("phone_number.#{format}") : super()
    ::PhoneNumbers::Internationalizer.new(phone_number: fake_number).execute.result
  end
end

Faker::PhoneNumber.singleton_class.prepend(Faker::FormattedPhoneNumber)
