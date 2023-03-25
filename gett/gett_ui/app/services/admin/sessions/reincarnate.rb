class Admin::Sessions::Reincarnate < ApplicationService
  include ApplicationService::Context

  attributes :company_id, :password

  delegate :admin, to: :context
  delegate :user_role_name, to: :admin

  def execute!
    if !company.active?
      set_errors('Company account has been deactivated')
    elsif company_admin.blank?
      set_errors('Company has no admin')
    elsif !company_admin.active?
      set_errors('Company admin has been deactivated')
    elsif not_authorized?
      set_errors('Invalid password')
    else
      @result = {
        token: JsonWebToken.encode(id: admin.id, reincarnated_as: company_admin.id),
        realm: company_admin.realm
      }
    end
  end

  private def company_admin
    company.admin
  end

  private def company
    @company ||= Company.with_pk!(company_id)
  end

  private def not_authorized?
    (user_role_name.customer_care? || user_role_name.outsourced_customer_care?) &&
      company.customer_care_password_required? && company.customer_care_password != password
  end
end
