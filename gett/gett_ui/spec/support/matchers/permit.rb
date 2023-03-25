RSpec::Matchers.define :permit do |service|
  chain :for do |user|
    @user = user
  end

  match do
    policy = subject.new(@user, service)
    policy.public_send(subject_permission)
  end

  failure_message do
    "Expected #{subject.name} to permit '#{subject_permission}' for #{identifier_for(@user)}, but did not"
  end

  failure_message_when_negated do
    "Expected #{subject.name} not to permit '#{subject_permission}' for #{identifier_for(@user)}, but did"
  end

  def identifier_for(model)
    "#{model.class.name}##{model.id}"
  end
end
