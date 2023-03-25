module HashRefinements
  refine Hash do
    def deep_reject
      reject do |k, v|
        v.replace(v.deep_reject(&Proc.new)) if v.is_a?(Hash)
        yield k, v
      end
    end
  end
end
