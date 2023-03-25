module CompanySettings
  class Show
    def initialize(member)
      @company = member.company
    end

    attr_reader :result

    CONTACT_ATTRIBUTES = %i(first_name last_name email phone mobile fax)
    ADDRESS_ATTRIBUTES = %i(line lat lng postal_code)

    def execute!
      @result = {}
      if @company.primary_contact
        @result[:primary_contact] = contact_attributes(@company.primary_contact)
      end
      if @company.billing_contact
        @result[:billing_contact] = contact_attributes(@company.billing_contact)
      end
    end

    private def contact_attributes(contact)
      contact.as_json(only: CONTACT_ATTRIBUTES, include: {address: {only: ADDRESS_ATTRIBUTES}})
    end
  end
end
