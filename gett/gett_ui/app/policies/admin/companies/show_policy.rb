class Admin::Companies::ShowPolicy < ServicePolicy
  allow_all!

  def can_destroy?
    policy(:destroy).execute?
  end
end
