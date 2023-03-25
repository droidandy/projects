using Sequel::CoreRefinements

Sequel.migration do
  up do
    from(:feedbacks).update(rating: :feedbacks[:rating] * 2)
  end

  down do
    from(:feedbacks).update(rating: :feedbacks[:rating] / 2)
  end
end
