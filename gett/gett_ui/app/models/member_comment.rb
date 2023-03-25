class MemberComment < Comment
  many_to_one :member

  def validate
    super
    validates_presence :member
  end
end
