module Onboarding
  class BaseStep < ApplicationService
    attr_reader :updated_user

    def execute!
      validate_required_checkboxes
      return fail! if errors?
      compose(::Users::Update.new(current_user, attributes.merge(user: current_user)), :updated_user)
      success! if @updated_user
    end

    private def onboarding_step
      current_user.onboarding_step == step ? step + 1 : current_user.onboarding_step
    end

    private def step
      raise 'not defined'
    end

    private def required_checkboxes
      []
    end

    private def validate_required_checkboxes
      required_checkboxes.each do |checkbox|
        next if send(checkbox)
        errors!(checkbox => ['You need to confirm acceptance to proceed'])
      end
    end
  end
end
