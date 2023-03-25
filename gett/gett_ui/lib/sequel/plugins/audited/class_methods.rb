module Sequel::Plugins::Audited::ClassMethods
  attr_accessor :audited_current_user_method
  attr_reader :audited_values, :audited_many_to_one, :audited_many_to_many,
    :audited_one_through_one, :audited_one_to_many, :audited_on

  Sequel::Plugins.inherited_instance_variables(
    self,
    :@audited_on              => nil,
    :@audited_values          => nil,
    :@audited_many_to_many    => nil,
    :@audited_many_to_one     => nil,
    :@audited_one_to_many     => nil,
    :@audited_one_through_one => nil
  )

  # returns true / false if any audits have been made
  #
  #   Post.audited_versions?   #=> true / false
  #
  def audited_versions?
    AuditLog.where(model_type: name.to_s).present?
  end

  # grab all audits for a particular model based upon filters
  #
  #   Posts.audited_versions(:model_pk => 123)
  #     #=> filtered by primary_key value
  #
  #   Posts.audited_versions(:created_at > Date.current - 7)
  #     #=> filtered to older than last seven (7) days
  #
  def audited_versions(opts = {})
    AuditLog.where(opts.merge(model_type: name.to_s)).order(:version).all
  end

  private def setup_audit_options(opts)
    @audited_on              ||= []
    @audited_values          ||= []
    @audited_many_to_many    ||= []
    @audited_one_through_one ||= []
    @audited_one_to_many     ||= []
    @audited_many_to_one     ||= []

    setup_audited_on(opts)
    setup_audited_values(opts)
    setup_audited_many_to_many(opts)
    setup_audited_one_through_one(opts)
    setup_audited_one_to_many(opts)
    setup_audited_many_to_one(opts)
  end

  private def setup_audited_on(opts)
    @audited_on = [opts.fetch(:on, [])].flatten
  end

  private def setup_audited_values(opts)
    @audited_values += opts.fetch(:values, [])
  end

  private def setup_audited_many_to_many(opts)
    audited_opts =
      opts.fetch(:many_to_many, []).map do |op|
        op.is_a?(Hash) ? op : { op => {} }
      end

    @audited_many_to_many += audited_opts
  end

  private def setup_audited_one_through_one(opts)
    @audited_one_through_one += opts.fetch(:one_through_one, [])
  end

  private def setup_audited_one_to_many(opts)
    @audited_one_to_many += opts.fetch(:one_to_many, [])
  end

  private def setup_audited_many_to_one(opts)
    audited_opts =
      opts.fetch(:many_to_one, []).map do |op|
        next { op => { key: "#{op}_id" } } unless op.is_a?(Hash)

        if op.values.first[:key]
          op
        else
          a_name = op.keys.first
          { a_name => op.values.first.merge(key: "#{a_name}_id") }
        end
      end

    @audited_many_to_one += audited_opts
  end
end
