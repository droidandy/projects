RSpec::Matchers.define :resolve_to do |expected|
  chain :for do |user|
    @user = user
  end

  match do
    records = subject.scope(scope_name).call(@user).all
    expect(records).to match_array(expected)
  end

  failure_message do
    record_ids = expected.map(&method(:identifier_for))
    actual_ids = records.map(&method(:identifier_for))

    "Expected #{subject.name}.scope to resolve to #{record_ids.inspect}, but resolved to #{actual_ids.inspect}"
  end

  def records
    @records ||= subject.scope(scope_name).call(@user).all
  end

  def identifier_for(model)
    "#{model.class.name}##{model.id}"
  end
end
