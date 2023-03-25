class Sessions::Onboard < ApplicationService
  include ApplicationService::ModelMethods

  attributes :member

  def execute!
    update_model(member, onboarding: false)
  end
end
