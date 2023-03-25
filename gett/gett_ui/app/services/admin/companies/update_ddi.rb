class Admin::Companies::UpdateDdi < ApplicationService
  include ApplicationService::ModelMethods

  attributes :company, :params

  def execute!
    transaction do
      old_ddi = company.ddi
      result { update_model(company, ddi: new_ddi) }
      destroy_model(old_ddi) if old_ddi.custom?
    end
  end

  private def new_ddi
    @new_ddi ||= ::Admin::Ddis::FetchPredefinedOrCreateCustom.new(params).execute.result
  end
end
