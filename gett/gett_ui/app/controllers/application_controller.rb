class ApplicationController < AuthenticatedController
  around_action :with_user_context

  def blank
    render plain: ''
  end

  private def current_company
    current_member&.company
  end

  private def with_user_context
    # Services that are not company-related, such as Users::UpdatePassword use `user`
    # context internally.
    # Most (if not all) of app-related services rely on `member` and `company` entities
    # in context. Despite the fact that `member` and `user` are the same object,
    # having them lexically different improves understanding of how service works
    # and what it depends on.
    context = {
      user: current_member,
      user_gid: current_user&.to_gid&.to_s,
      member: current_member,
      company: current_company,
      reincarnated: reincarnated?,
      original_user: reincarnated? ? current_user : nil,
      front_office: true,
      # TODO: refactor in favor of "sanitize explicitly where needed"-based solution
      sanitize_home_address: true
    }

    ApplicationService::Context.with_context(context){ yield }
  end

  private def authenticate
    super

    head :unauthorized if current_user.is_a?(Member) && current_member.blank?
  end

  private def reincarnated?
    return @reincarnated if defined?(@reincarnated)

    @reincarnated = current_user.present? && current_member.present? && current_user.id != current_member.id
  end

  private def skip_address_sanitize
    HomePrivacy.with_sanitize(false) do
      yield
    end
  end
end
