class ServicePolicy
  attr_reader :user, :service
  alias member user

  def self.inherited(klass)
    klass.send(:prepend, SystemUser)
  end

  def self.allow_all!
    define_method(:execute?) { true }
  end

  def self.deny_all!
    define_method(:execute?) { false }
  end

  def self.allow(*permissions)
    permissions.each{ |name| define_method("#{name}?") { true } }
  end

  def self.disallow(*permissions)
    permissions.each{ |name| define_method("#{name}?") { false } }
  end

  def self.scope(name = :default, &block)
    return scoping_block(name) unless block_given?

    scoping_blocks[name] = block
  end

  def self.scoping_blocks
    @scoping_blocks ||= {}
  end

  def self.scoping_block(name)
    scoping_blocks[name] || fail("use .scope method to define scoping block first")
  end

  def initialize(user, service)
    @user = user
    @service = service
  end

  def scope(name = :default)
    self.class.scoping_block(name).call(user)
  end

  def policy(klass)
    policy_class = klass.is_a?(Class) ? klass : "#{self.class.parent}::#{klass.to_s.camelize}Policy".constantize

    policy_class.new(user, service)
  end

  module SystemUser
    # in background or in tests services are executed with :system user by default
    def execute?
      user == :system || super
    end
  end
end
