require_relative './options.rb'

module Sequel::Plugins::Audited::InstanceMethods
  include ::Options

  # Returns who put the post into its current state.
  #
  #   post.blame  # => 'joeblogs'
  #
  #   post.last_audited_by  # => 'joeblogs'
  #
  # Note! returns 'not audited' if there's no audited version (new unsaved record)
  #
  def blame
    v = versions.last unless versions.empty?
    v ? v.username : 'not audited'
  end
  alias_method :last_audited_by, :blame

  # Returns who put the post into its current state.
  #
  #   post.last_audited_at  # => '2015-12-19 @ 08:24:45'
  #
  #   post.last_audited_on  # => 'joeblogs'
  #
  # Note! returns 'not audited' if there's no audited version (new unsaved record)
  #
  def last_audited_at
    v = versions.last unless versions.empty?
    v ? v.created_at : 'not audited'
  end
  alias_method :last_audited_on, :last_audited_at

  def add_change(subject, name)
    unless Rails.application.config.sequel.audited_disabled
      create_version(
        Sequel::Audited::MANUAL,
        { subject => name }
      )
    end
  end

  private def create_version(event, changed, obj=self)
    if event != Sequel::Audited::MANUAL &&
        model.audited_on.present? &&
        model.audited_on.exclude?(event.to_sym)
      return
    end

    obj.add_version(
      model_type: obj.model,
      model_pk:   pk,
      event:      event,
      changed:    changed
    )
  end

  private def columns_that_changed
    column_changes.empty? ? previous_changes : column_changes
  end

  ### CALLBACKS ###

  private def before_save
    unless Rails.application.config.sequel.audited_disabled
      add_audited_by_many_to_many
    end
    super
  end

  private def after_create
    super
    unless Rails.application.config.sequel.audited_disabled
      add_audited_by_values(Sequel::Audited::CREATE) #TODO implement creation
      add_audited_by_many_to_one(Sequel::Audited::CREATE) #TODO implement creation
      add_audited_by_one_through_one(Sequel::Audited::CREATE)
      add_audited_by_one_to_many(Sequel::Audited::CREATE)

      save_audited_by_many_to_many
    end
  end

  private def after_update
    super
    unless Rails.application.config.sequel.audited_disabled
      add_audited_by_values(Sequel::Audited::UPDATE) #TODO implement creation
      add_audited_by_many_to_one(Sequel::Audited::UPDATE) #TODO implement creation
      add_audited_by_one_through_one(Sequel::Audited::UPDATE)
    end
  end

  private def after_destroy
    super
    unless Rails.application.config.sequel.audited_disabled
      #add_audited_by_values(Sequel::Audited::DESTROY) #TODO implement creation
      #add_audited_by_many_to_one(Sequel::Audited::DESTROY) #TODO implement creation
      add_audited_by_one_through_one(Sequel::Audited::DESTROY)
    end
  end
end
