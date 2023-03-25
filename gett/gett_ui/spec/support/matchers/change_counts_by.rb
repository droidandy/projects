RSpec::Matchers.define :change_counts_by do |expected_changes|
  supports_block_expectations

  match do |block|
    @before_counts = counts(expected_changes.keys)
    block.call
    @after_counts = counts(expected_changes.keys)
    first_unmatched_count(expected_changes).nil?
  end

  failure_message do
    countable, actual = first_unmatched_count(expected_changes)
    "expected #{countable}.count to be changed by #{expected_changes[countable]}, but was changed by #{actual}"
  end

  def counts(countables)
    countables.each_with_object({}) do |countable, counts|
      counts[countable] = countable.count
    end
  end

  def first_unmatched_count(expectation)
    expectation.each do |countable, expected|
      actual = @after_counts[countable] - @before_counts[countable]
      return [countable, actual] if actual != expected
    end
    nil
  end
end
