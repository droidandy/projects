RSpec::Matchers.define :use_policy_scope do |*names|
  chain :returning do |dataset|
    @dataset = dataset
  end

  match do
    (names.presence || [:default]).each do |name|
      receive_matcher = receive(:policy_scope).at_least(:once)
      receive_matcher.with(name) unless name == :default

      if @dataset
        expect(subject).to receive_matcher.and_return(@dataset.nullify)
      else
        expect(subject).to receive_matcher.and_call_original
      end
    end

    subject.execute
  end
end
