require 'rails_helper'

RSpec.describe S3TmpFile do
  let(:connection) { described_class.connection }
  let(:default_directory) { described_class.default_directory }
  let(:default_bucket_name) { Settings.s3.tmp_bucket }
  let(:file_prefix) { "#{Rails.env}/#{Settings.s3.tmp_prefix}" }
  let(:first_file_name) { 'Veni/vidi/vici.win' }
  let(:second_file_name) { 'Memento/mori.rome' }
  let(:invisible_file_name) { 'some/song.flac' }

  before do
    @first_file =
      default_directory.files.create(
        key:    "#{file_prefix}/#{first_file_name}",
        body:   'Gaius Iulius Caesar',
        public: false
      )
    @second_file =
      default_directory.files.create(
        key:    "#{file_prefix}/#{second_file_name}",
        body:   'Respice post te! Hominem te memento!',
        public: false
      )
    @invisible_file =
      default_directory.files.create(
        key:    invisible_file_name,
        body:   'Now you see me now you dont',
        public: false
      )
  end

  after { default_directory.files.each(&:destroy) }

  describe '#default_directory' do
    it 'returns directory specified in settings' do
      expect(default_directory.key).to eq(default_bucket_name)
    end
  end

  describe '#ls' do
    it 'returns names of available and visible files' do
      expect(described_class.ls).to match_array([first_file_name, second_file_name])
    end
  end

  describe '#ls_files' do
    it 'returns list of available and visible files' do
      expect(described_class.ls_files).to match_array([@first_file, @second_file])
    end
  end

  describe '#file' do
    it 'returns existed file by short name' do
      expect(described_class.file(first_file_name)).to eq(@first_file)
    end

    it 'returns nothing for file from another scope' do
      expect(described_class.file(invisible_file_name)).to be_nil
    end

    it 'returns nothing for non existing file' do
      expect(described_class.file('krible-krable-bums')).to be_nil
    end
  end

  describe '#read' do
    it 'returns existed file content by short name' do
      expect(described_class.read(second_file_name)).to eq(@second_file.body)
    end

    it 'returns nothing for file from another scope' do
      expect(described_class.read(invisible_file_name)).to be_nil
    end

    it 'returns nothing for non existing file' do
      expect(described_class.file('krible-krable-bums')).to be_nil
    end
  end

  describe '#write' do
    let(:new_file_name) { 'dragonborn.char' }
    let(:new_file_content) { 'Dowakin' }

    it 'create a new file with described content' do
      expect(described_class.write(new_file_name, new_file_content)).to eq(new_file_name)
      expect(described_class.read(new_file_name)).to eq(new_file_content)
    end

    it 'update content of an existed file' do
      expect(described_class.write(first_file_name, new_file_content)).to eq(first_file_name)
      expect(described_class.read(first_file_name)).to eq(new_file_content)
    end
  end

  describe '#delete' do
    it 'removes existing file by short name' do
      expect{ described_class.delete(first_file_name) }
        .to change{ default_directory.files.each_with_object([]){ |f, h| h << f }.count }
        .from(3)
        .to(2)
      expect(default_directory.files.get(first_file_name)).to be_nil
    end

    it 'do nothing for invisible file name' do
      expect{ described_class.delete(invisible_file_name) }
        .to_not change{ default_directory.files.each_with_object([]){ |f, h| h << f }.count }
    end
  end

  describe '#delete_dir' do
    it 'removes existing dir by name' do
      expect{ described_class.delete_dir('Memento') }
        .to change{ default_directory.files.each_with_object([]){ |f, h| h << f }.count }
        .from(3)
        .to(2)
      expect(default_directory.files.get(second_file_name)).to be_nil
    end

    it 'do nothing for invisible dir name' do
      expect{ described_class.delete('some') }
        .to_not change{ default_directory.files.each_with_object([]){ |f, h| h << f }.count }
    end
  end
end
