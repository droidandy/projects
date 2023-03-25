module OneTransport
  class Modify < OneTransport::Create
    def soap_method
      :job_modify
    end
  end
end
