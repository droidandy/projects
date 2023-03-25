require_relative './options/one_to_many.rb'
require_relative './options/one_through_one.rb'
require_relative './options/many_to_many.rb'
require_relative './options/many_to_one.rb'
require_relative './options/values.rb'

module Options
  include OneToMany
  include OneThroughOne
  include ManyToMany
  include ManyToOne
  include Values
end
