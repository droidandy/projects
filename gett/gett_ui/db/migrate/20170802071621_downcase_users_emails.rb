Sequel.migration do
  up do
    from(:users).update(email: Sequel.function(:lower, :email))
  end
end
