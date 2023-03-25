module HomePrivacy
  module AuditLogExtension
    private def transform_value(key, value)
      return value if value.blank?
      return HOME if HomePrivacy.sanitize? && key == 'home_address'

      super
    end
  end
end
