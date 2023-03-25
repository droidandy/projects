module HomePrivacy
  # Helper module used to skip home address sanitinization logic in Front Office.
  # If service that includes this module defined `#skip_sanitize_home_address?` method,
  # it's return value will define whether or not home addresses should be sanitized
  # during service execution.
  # Such name, `skip_sanitize_home_address?`, instead of more straight-forward
  # `should_sanitize_home_address?` was picked to conform `HomeAddress::AddressHelpers`
  # module's method options and also due to the fact that in majority of cases
  # the check will look like `context.member&.id == passenger.id`, which will allow
  # to avoid additional `context.present?` (to keep service runnable in console)
  module ServiceHelpers
    def execute
      return super unless respond_to?(:skip_sanitize_home_address?)

      HomePrivacy.with_sanitize(!skip_sanitize_home_address?) do
        super
      end
    end
  end
end
