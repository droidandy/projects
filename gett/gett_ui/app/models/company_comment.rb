class CompanyComment < Comment
  many_to_one :company

  def validate
    super
    validates_presence :company
  end
end
