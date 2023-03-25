class BookingComment < Comment
  many_to_one :booking

  def validate
    super
    validates_presence :booking
  end
end
