shared_examples_for 'the one that updates driver path points' do |opts|
  point = opts[:response_point]

  def path_points_length(booking)
    booking.driver&.reload&.path_points&.length.to_i
  end

  describe "path points updating" do
    specify "when no path points information exists" do
      expect{ service.execute }.to change{ path_points_length(booking) }.by(1)
    end

    context "when last point is the same as new point" do
      let!(:booking_driver) { create(:booking_driver, booking: booking, path_points: [point]) }

      it "does not add new point" do
        expect{ service.execute }.not_to change{ path_points_length(booking) }
      end
    end

    context "when last point is not the same as new point" do
      let!(:booking_driver) { create(:booking_driver, booking: booking, path_points: [point.map{ |v| v.try(:+, 1) }]) }

      it "adds new point" do
        expect{ service.execute }.to change{ path_points_length(booking) }.by(1)
      end
    end
  end
end
