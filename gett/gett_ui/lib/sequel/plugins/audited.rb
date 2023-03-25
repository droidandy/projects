require_relative 'audited/audited'
require_relative 'audited/audit_log'

module Sequel::Plugins::Audited
  require_relative 'audited/class_methods'
  require_relative 'audited/instance_methods'

  def self.configure(model, opts = {})
    model.instance_eval do
      # add support for :dirty attributes tracking & JSON serializing of data
      plugin(:dirty)
      plugin(:json_serializer)

      setup_audit_options(opts)

      one_to_many(
        :versions,
        class: AuditLog,
        key: :model_pk,
        conditions: { model_type: model.name.to_s }
      )
    end
  end
end
