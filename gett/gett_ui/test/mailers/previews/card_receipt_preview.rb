class CardReceiptPreview < ActionMailer::Preview
  def card_receipt
    booking = Booking.completed.exclude(passenger_id: nil).last

    CardReceiptMailer.card_receipt(booking)
  end
end
