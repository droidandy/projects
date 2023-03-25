module Members
  class PassGuide < ApplicationService
    include ApplicationService::ModelMethods

    attributes :member

    def execute!
      update_model(member, guide_passed: true)
    end
  end
end
