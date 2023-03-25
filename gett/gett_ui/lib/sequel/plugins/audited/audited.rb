module Sequel::Audited
  CREATE      = 'create'.freeze
  UPDATE      = 'update'.freeze
  DESTROY     = 'destroy'.freeze
  CHANGE_MANY = 'change_many'.freeze
  MANUAL      = 'created_manually'.freeze

  class << self
    def enabled?
      Rails.application.config.sequel.audited_enabled
    end

    def enabled=(value)
      Rails.application.config.sequel.audited_enabled = value
    end
  end
end
