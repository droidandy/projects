require 'csv'

module Admin
  class BookingReferences::AttachmentProcessor
    attr_reader :booking_reference, :attachment

    def initialize(booking_reference, attachment)
      @booking_reference = booking_reference
      @attachment = attachment
    end

    def process!
      File.readlines(attachment.path).each_slice(1000) do |lines|
        DB[:reference_entries].import(
          [:booking_reference_id, :value],
          lines.map{ |line| [booking_reference.id, line.chomp] }
        )
      end
      true
    rescue StandardError
      false
    end
  end
end
