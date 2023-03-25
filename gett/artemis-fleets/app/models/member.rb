class Member < User
  belongs_to :company
  validates :active, inclusion: {in: [true, false]}

  enum role: {
    admin: 0,
    user: 1,
    finance: 2
  }

  def active?
    attributes['active'] && company.active?
  end

  def full_name
    [first_name, last_name].reject(&:blank?).join(' ')
  end
end
