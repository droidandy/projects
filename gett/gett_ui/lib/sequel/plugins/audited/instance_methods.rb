require_relative 'track/values'
require_relative 'track/many_to_one'
require_relative 'track/many_to_many'
require_relative 'track/one_through_one'
require_relative 'track/one_to_many'

module Sequel::Plugins::Audited::InstanceMethods
  # Returns who put the post into its current state.
  #
  #   post.blame  # => 'joeblogs'
  #   post.last_audited_by  # => 'joeblogs'
  #
  # Note! returns 'not audited' if there's no audited version (new unsaved record)
  #
  def blame
    return 'not audited' if versions.empty?

    versions.last.username
  end
  alias last_audited_by blame

  # Returns who put the post into its current state.
  #
  #   post.last_audited_at  # => '2015-12-19 @ 08:24:45'
  #   post.last_audited_on  # => '2015-12-19 @ 08:24:45'
  #
  # Note! returns 'not audited' if there's no audited version (new unsaved record)
  #
  def last_audited_at
    return 'not audited' if versions.empty?

    versions.last.created_at
  end
  alias last_audited_on last_audited_at

  def add_change(subject, name)
    return unless Sequel::Audited.enabled?

    create_version(Sequel::Audited::MANUAL, subject => name)
  end

  def create_version(event, changed, observed_object = self)
    if event != Sequel::Audited::MANUAL &&
        model.audited_on.present? &&
        model.audited_on.exclude?(event.to_sym)
      return
    end

    # TODO: use AuditLog.create
    observed_object.add_version(
      model_type: observed_object.model,
      model_pk:   pk,
      event:      event,
      changed:    changed
    )
  end

  private def changed_columns_values(event = nil)
    if event.in?([Sequel::Audited::CREATE, Sequel::Audited::DESTROY])
      values.each_with_object({}) do |(key, val), res|
        next if val.nil?

        val = object.column_changes[key].present? ? object.column_changes[key][1] : val

        res[key] = (event == Sequel::Audited::CREATE) ? [nil, val] : [val, nil]
      end
    else
      column_changes.empty? ? previous_changes : column_changes
    end
  end

  ### CALLBACKS ###

  private def before_save
    @changes = Track::ManyToMany.new(self, nil).get_changes

    super
  end

  private def after_create
    super

    Track::Values.new(self, Sequel::Audited::CREATE).save_changes
    Track::ManyToOne.new(self, Sequel::Audited::CREATE).save_changes
    Track::OneThroughOne.new(self, Sequel::Audited::CREATE).save_changes
    Track::OneToMany.new(self, Sequel::Audited::CREATE).save_changes

    Track::ManyToMany.new(self, nil).save_changes(@changes)
  end

  private def after_update
    super

    Track::Values.new(self, Sequel::Audited::UPDATE).save_changes
    Track::ManyToOne.new(self, Sequel::Audited::UPDATE).save_changes
    Track::OneThroughOne.new(self, Sequel::Audited::UPDATE).save_changes
  end

  private def after_destroy
    super

    Track::Values.new(self, Sequel::Audited::DESTROY).save_changes
    Track::ManyToOne.new(self, Sequel::Audited::DESTROY).save_changes
    Track::OneThroughOne.new(self, Sequel::Audited::DESTROY).save_changes
  end
end
