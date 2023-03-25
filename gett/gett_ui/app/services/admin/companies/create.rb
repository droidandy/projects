module Admin::Companies
  class Create < ApplicationService
    include ApplicationService::ModelMethods
    include ApplicationService::Policy
    include ApplicationService::Context
    include Admin::Companies::CommonParams

    attributes :params

    delegate :as_json, to: :company

    def self.policy_class
      Admin::Companies::Policy
    end

    def execute!
      transaction do
        result { create_model(company, company_params, custom_attributes, ddi: ddi) }
        assert { create_model(company_info, company_info_params) }
        assert { create_model(payment_options, payment_option_params) }
        assert { create_model(admin, admin_params) }
        assert { admin.set_reset_password_token! } if admin.persisted? && onboarding?
        assert { assign_address(company_info, address_params) }
        assert { enable_hr_feed_service.execute } if company.hr_feed_enabled?
        assert { generate_api_key } if admin.persisted? && company.api_enabled? && company.api_key.blank?

        if legal_address_submitted?
          assert { assign_address(company_info, legal_address_params, key: :legal_address_id) }
        end

        assert { create_model(primary_contact, primary_contact_params) }
        update_model(primary_contact, address_id: company_info.address.id) if primary_contact.persisted? && company_info.persisted?
      end

      invite_admin if success? && onboarding?
    end

    def company
      @company ||= Company.new
    end

    def company_info
      @company_info ||= CompanyInfo.new(company_id: company.id)
    end

    def payment_options
      @payment_options ||= PaymentOptions.new(company_id: company.id)
    end

    def admin
      @admin ||= Member.new(company_id: company.id, role: Role[:companyadmin])
    end

    def primary_contact
      @primary_contact ||= Contact.new(company_id: company.id, primary: true)
    end

    def ddi
      @ddi ||= Admin::Ddis::FetchPredefinedOrCreateCustom.new(params[:ddi]).execute.result
    end

    private def invite_admin
      MembersMailer.admin_invitation(admin.id).deliver_later
    end

    private def onboarding?
      !!params[:admin][:onboarding]
    end

    private def custom_attributes
      params.fetch(:custom_attributes, {})
    end

    private def payment_option_params
      params[:payment_options]
    end

    private def admin_params
      if onboarding?
        params[:admin].except(:password)
      else
        params[:admin].merge(password_confirmation: params[:admin][:password])
      end
    end

    private def address_params
      params[:address]
    end

    private def legal_address_params
      params[:legal_address]
    end

    private def primary_contact_params
      admin_params.slice(:first_name, :last_name, :phone, :mobile, :email)
    end

    private def legal_address_submitted?
      legal_address_params.present? && legal_address_params[:line].present?
    end

    private def enable_hr_feed_service
      @enable_hr_feed_service ||= Admin::Companies::EnableSftp.new(company: company)
    end

    private def generate_api_key
      create_model(ApiKey.new, user: company.admin)
    end

    def errors
      consolidate_errors company.errors, company_info.errors,
        address:         (company_info.address&.valid?) ? nil : ['invalid address'],
        legal_address:   (!legal_address_submitted? || company_info.legal_address&.valid?) ? nil : ['invalid address'],
        payment_options: payment_options.errors,
        admin:           admin.errors
    end
  end
end
