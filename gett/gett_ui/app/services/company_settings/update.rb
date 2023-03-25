module CompanySettings
  class Update < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context
    include ApplicationService::ModelMethods

    attributes :params

    delegate :company, to: :context

    def execute!
      transaction do
        success!
        UpdateContact.new(primary: true, params: primary_params).execute
        UpdateContact.new(primary: false, params: billing_params).execute
        assert { supersede_company_info } if company_info.used?
        assert { assign_address(company_info, address_params) }
      end
    end

    def company_info
      return @company_info if defined? @company_info

      company.company_info
    end

    private def supersede_company_info
      update_model(company_info, active: false)
      @company_info = company_info.superseded_clone
      create_model(company_info, active: true)
    end

    private def address_params
      params[:address]
    end

    private def primary_params
      params[:primary_contact]
    end

    private def billing_params
      params[:billing_contact]
    end

    class UpdateContact < ApplicationService
      include ApplicationService::ModelMethods
      include ApplicationService::Context

      delegate :company, to: :context

      attributes :primary, :params

      def execute!
        return clear_contact if all_blank?

        create_or_update_contact
        assign_address(contact, address_params)
      end

      private def clear_contact
        return if contact.blank?

        if contact.primary? && contact.used?
          update_model(contact, active: false)
        else
          destroy_model(contact)
        end
      end

      private def contact
        return @contact if defined? @contact

        primary ? company.primary_contact : company.billing_contact
      end

      private def all_blank?
        contact_params.blank? && address_params.blank?
      end

      private def create_or_update_contact
        @contact = contact || build_contact(primary)

        if contact.primary? && contact.used?
          update_model(contact, active: false)
          @contact = build_contact(true)
          create_model(contact, contact_params)
        else
          update_model(contact, contact_params)
        end
      end

      private def build_contact(primary)
        Contact.new(company_id: company.id, primary: primary)
      end

      private def contact_params
        params&.except(:address)
      end

      private def address_params
        params.try(:[], :address)
      end
    end
    private_constant :UpdateContact
  end
end
