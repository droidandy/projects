class Admin::Ddis::FetchPredefinedOrCreateCustom < ApplicationService
  attributes :type, :phone

  def execute!
    if type == Ddi::Type::CUSTOM
      Ddi.create(type: type, phone: phone)
    else
      Ddi.fetch(type)
    end
  end
end
