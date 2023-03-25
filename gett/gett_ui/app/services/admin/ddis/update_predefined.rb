class Admin::Ddis::UpdatePredefined < ApplicationService
  include ApplicationService::ModelMethods

  attributes :type, :phone

  def execute!
    return unless type.in?(Ddi::Type::PREDEFINED_TYPES)

    update_model(ddi, phone: phone)
  end

  private def ddi
    @ddi ||= Ddi.fetch(type)
  end
end
