class Admin::Members::Update < ::Passengers::Update
  attributes :member

  alias passenger member

  delegate :company, to: :member
end
