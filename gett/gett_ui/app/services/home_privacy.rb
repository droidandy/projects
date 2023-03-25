# HomePrivacy module hosts auxiliary functionality for hiding passenger home
# address information application-wide. It consists of following modules:
# - `HomePrivacy::AddressHelper` that hosts utilities for sanitanization
#   of address information itself
# - `HomePrivacy::AuditLogExtension` that is included in `Passengers::AuditLog`
#   to filter out home address from rendered change log.
# - `HomePrivacy::ControllerHelpers` that hosts functionality of restoring
#   sanitized address params based on it's id to be able for the rest of the
#   app to work transparently as if no sanitanization happened
# - `HomePrivacy::SequelRefinements` with a helpers to generate sanitized
#   CASE-based SQL fragment when generating datasets.
module HomePrivacy
  HOME = 'Home'.freeze

  module_function

  def sanitize?
    ApplicationService::Context.context&.front_office? &&
      ApplicationService::Context.context&.sanitize_home_address?
  end

  def with_sanitize(sanitize)
    ApplicationService::Context.with_context(sanitize_home_address: sanitize) do
      yield
    end
  end
end
