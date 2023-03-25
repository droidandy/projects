module Admin::Companies
  class Update < ApplicationService
    include ApplicationService::ModelMethods
    include ApplicationService::Policy
    include ApplicationService::Context
    include Admin::Companies::CommonParams

    attributes :company, :params, :toggle_status

    delegate :admin, :payment_options, to: :company

    def self.policy_class
      Admin::Companies::Policy
    end

    def execute!
      transaction do
        result { update_model(company, company_params, custom_attributes) }
        assert { update_ddi_service.execute.success? }

        if company_info.used?
          supersede_company_info
        else
          assert { update_model(company_info, company_info_params) }
        end
        assert { update_model(payment_options, payment_option_params) }
        assert { update_model(admin, admin_params) }
        assert { assign_address(company_info, address_params) }
        assert { assign_address(company_info, legal_address_params, key: :legal_address_id) }
        assert { enable_sftp_service.execute } if company.hr_feed_enabled?
        assert { generate_api_key } if company.api_enabled? && company.api_key.blank?
      end
    end

    def company_info
      return @company_info if defined? @company_info

      company.company_info
    end

    private def supersede_company_info
      assert { update_model(company_info, active: false) }
      @company_info = CompanyInfo.new(company: company)
      assert { create_model(company_info, company_info_params) }
    end

    private def custom_attributes
      params.fetch(:custom_attributes, {})
    end

    private def payment_option_params
      params[:payment_options]
    end

    private def admin_params
      params[:admin]
    end

    private def address_params
      params[:address]
    end

    private def legal_address_params
      params[:legal_address]
    end

    private def legal_address_submitted?
      legal_address_params.present? && legal_address_params[:line].present?
    end

    private def enable_sftp_service
      @enable_sftp_service ||= Admin::Companies::EnableSftp.new(company: company)
    end

    private def update_ddi_service
      @update_ddi_service ||= UpdateDdi.new(company: company, params: params[:ddi])
    end

    private def generate_api_key
      create_model(ApiKey.new, user: company.admin)
    end

    def errors
      consolidate_errors company.errors, company_info.errors,
        address:         (company_info.address&.valid?) ? nil : ['invalid address'],
        legal_address:   (!legal_address_submitted? || company_info.legal_address.valid?) ? nil : ['invalid address'],
        payment_options: payment_options.errors,
        admin:           admin.errors
    end
  end
end
