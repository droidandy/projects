module Admin
  module Companies
    class Edit
      def initialize(company)
        @company = company
      end

      attr_reader :result

      def execute!
        @result = @company.as_json(
          only: %i(id name vat_number cost_centre legal_name salesman_id fleet_id)
        ).merge(
          logo_url: @company.logo&.url,
          admin: admin_attributes,
          address: address_attributes,
          legal_address: legal_address_attributes
        )
      end

      private def admin_attributes
        @company.admin&.as_json(
          only: %i(email password first_name last_name phone)
        )
      end

      private def address_attributes
        @company.address&.as_json(
          only: %i(line lat lng postal_code)
        )
      end

      private def legal_address_attributes
        @company.legal_address&.as_json(
          only: %i(line lat lng postal_code)
        )
      end
    end
  end
end
