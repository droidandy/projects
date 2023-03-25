require 'rails_helper'

describe ApplicationUploader do
  let(:booking_reference) { create(:booking_reference) }
  let(:uploader_class)    { Class.new(ApplicationUploader) }

  describe '#store_dir' do
    let(:uploader) { uploader_class.new(model, :avatar) }

    before { allow(uploader).to receive(:base_folder).and_return('/folder') }

    context 'when model is User' do
      let(:model) { create(:user) }

      it 'stores attachment under "member" dir' do
        expect(uploader.store_dir).to eq("/folder/member/avatar/#{model.id}")
      end
    end
  end
end
