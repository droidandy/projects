class Companies::CreateSignupRequest < ApplicationService
  include ApplicationService::ModelMethods

  attributes :params

  def execute!
    if params[:accept_tac].blank? || params[:accept_pp].blank?
      set_errors(I18n.t('services.companies.create_signup_request.errors.wrong_policies'))
      return
    end

    result { create_model(signup_request, request_params) }

    CompanyMailer.signup_request(signup_request.id).deliver_later if success?
  end

  def errors
    @errors ||= signup_request.errors
  end

  private def signup_request
    @signup_request ||= CompanySignupRequest.new
  end

  private def request_params
    params.to_h.with_indifferent_access.except(:accept_tac, :accept_pp)
  end
end
