module Invites
  class Decode < ApplicationService
    attr_reader :invite

    schema do
      required(:token).filled(:str?)
    end

    def initialize(args)
      super(nil, args)
    end

    def execute!
      search = Invites::Search.new({ active: true, digest: digest }, current_user: current_user)
      @invite = search.one

      if @invite.nil? || @invite.accepted_step? || @invite.expired?
        return fail!(errors: { token: 'is expired or wrong' })
      end

      success!
    end

    private def digest
      @digest ||= Digest::SHA256.hexdigest(token)
    end
  end
end
