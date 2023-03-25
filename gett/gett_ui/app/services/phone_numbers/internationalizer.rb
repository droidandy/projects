module PhoneNumbers
  class Internationalizer < ApplicationService
    attributes :phone_number

    def execute!
      return if phone_number.blank?

      clean_phone_number = phone_number.delete('^+0-9')

      case clean_phone_number[0, 2]
      when '01', '02', '03', '07'
        clean_phone_number.sub('0', '+44')
      when '20', '84'
        "+44#{clean_phone_number}"
      when '44', '97'
        "+#{clean_phone_number}"
      else
        clean_phone_number
      end
    end
  end
end
