module Sequel::Plugins::Audited::ClassMethods
  attr_accessor :audited_current_user_method
  attr_reader :audited_values, :audited_many_to_one,
    :audited_many_to_many, :audited_one_through_one,
    :audited_one_to_many, :audited_on

  Sequel::Plugins.inherited_instance_variables(self,
                                       :@audited_on                  => nil,
                                       :@audited_current_user_method => nil,
                                       :@audited_values              => nil,
                                       :@audited_many_to_many        => nil,
                                       :@audited_many_to_one         => nil,
                                       :@audited_one_to_many         => nil,
                                       :@audited_one_through_one     => nil
                                      )

  # returns true / false if any audits have been made
  #
  #   Post.audited_versions?   #=> true / false
  #
  def audited_versions?
    audit_model.where(model_type: name.to_s).count >= 1
  end

  # grab all audits for a particular model based upon filters
  #
  #   Posts.audited_versions(:model_pk => 123)
  #     #=> filtered by primary_key value
  #
  #   Posts.audited_versions(:user_id => 88)
  #     #=> filtered by user name
  #
  #   Posts.audited_versions(:created_at < Date.today - 2)
  #     #=> filtered to last two (2) days only
  #
  #   Posts.audited_versions(:created_at > Date.today - 7)
  #     #=> filtered to older than last seven (7) days
  #
  def audited_versions(opts = {})
    audit_model.where(opts.merge(model_type: name.to_s)).order(:version).all
  end

  private

  def audit_model
    const_get(audit_model_name)
  end

  def audit_model_name
    ::Sequel::Audited.audited_model_name
  end

  def set_user_method(opts)
    if opts[:user_method]
      @audited_current_user_method = opts[:user_method]
    else
      @audited_current_user_method = ::Sequel::Audited.audited_current_user_method
    end
  end
end
