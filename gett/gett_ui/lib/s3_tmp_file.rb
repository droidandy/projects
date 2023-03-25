module S3TmpFile
  module_function

  private def connection
    @connection ||= Fog::Storage.new(
      aws_access_key_id:     Settings.s3.tmp_id,
      aws_secret_access_key: Settings.s3.tmp_secret,
      provider:              'AWS',
      region:                'eu-west-1'
    )
  end

  private def default_directory
    @default_directory ||= connection.directories.get(Settings.s3.tmp_bucket)
  end

  private def name_prefix
    [Rails.env, Settings.s3.tmp_prefix].select(&:present?).join('/')
  end

  private def full_name(name)
    "#{name_prefix}/#{name}"
  end

  def ls_files
    # NOTE: only each works properly for iterate over S3 files
    default_directory.files.each_with_object([]) do |f, h|
      if f.key =~ /^#{name_prefix}/
        h << f
      end
    end
  end

  def ls
    ls_files.map{ |f| f.key.sub("#{name_prefix}/", '') }
  end

  def write(name, data)
    result = default_directory.files.create(
      key:    full_name(name),
      body:   data,
      public: false
    )
    name if result.persisted?
  end

  def file(name)
    default_directory.files.get(full_name(name))
  end

  def read(name)
    file(name)&.body
  end

  def delete(name)
    file(name)&.destroy
  end

  def delete_dir(name)
    # NOTE: only each works properly for iterate over S3 files
    ls_files.each_with_object([]) do |f, h|
      if f.key =~ /^#{full_name(name)}/
        h << f.destroy
      end
    end.all?
  end
end
