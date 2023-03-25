require 'sequel'
require 'sequel/audited/version'

module Sequel
  module Audited

    CREATE      = 'create'
    UPDATE      = 'update'
    DESTROY     = 'destroy'
    CHANGE_MANY = 'change_many'
    MANUAL      = 'created_manually'

    # set the name of the global method that provides the current user. Default: :current_user
    @audited_current_user_method = :current_user
    # enable swapping of the Audit model
    @audited_model_name          = :AuditLog
    # toggle for enabling / disabling auditing
    @audited_enabled             = true


    class << self
      attr_accessor :audited_current_user_method, :audited_model_name, :audited_enabled
    end
  end
end
