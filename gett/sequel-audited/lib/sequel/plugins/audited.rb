require_relative '../src/audit_log'

module Sequel::Plugins::Audited
  require_relative '../src/class_methods'
  require_relative '../src/instance_methods'

  def self.configure(model, opts = {})
    model.instance_eval do
      # add support for :dirty attributes tracking & JSON serializing of data
      plugin(:dirty)
      plugin(:json_serializer)

      # sets the name of the current User method or revert to default: :current_user
      # specifically for the audited model on a per model basis
      set_user_method(opts)

      @audited_on              = [opts.fetch(:on, [])].flatten
      @audited_values          = @audited_values.to_a + opts.fetch(:values, []).to_a
      @audited_many_to_many    = @audited_many_to_many.to_a + begin
        opts.fetch(:many_to_many, []).to_a.map do |op|
          op.is_a?(Hash) ? op : { op => {} }
        end
      end
      @audited_one_through_one = @audited_one_through_one.to_a + opts.fetch(:one_through_one, []).to_a
      @audited_one_to_many     = @audited_one_to_many.to_a + opts.fetch(:one_to_many, []).to_a
      @audited_many_to_one     = @audited_many_to_one.to_a + begin
        opts.fetch(:many_to_one, []).to_a.map do |op|
          if op.is_a?(Hash)
            if op.values.first[:key]
              op
            else
              a_name = op.keys.first
              {}.tap { |res| res[a_name] = op.values.first.merge(key: "#{a_name}_id") }
            end
          else
            {}.tap { |res| res[op] = { key: "#{op}_id" } }
          end
        end
      end

      one_to_many(
        :versions,
        class: audit_model_name,
        key: :model_pk,
        conditions: { model_type: model.name.to_s }
      )
    end
  end
end
