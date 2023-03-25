package com.benrevo.be.modules.rfp.service;

import com.benrevo.common.dto.OptionDto;
import com.benrevo.data.persistence.mapper.OptionMapper;
import com.benrevo.data.persistence.entities.Option;
import com.benrevo.data.persistence.repository.OptionRepository;
import com.benrevo.common.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.benrevo.common.util.MapBuilder.field;

@Service
@Transactional
public class OptionService {

    @Autowired
    private OptionRepository optionRepository;

    public List<OptionDto> getOptionsByRfpId(Long rfpId) {
        final List<Option> options = optionRepository.findByRfpRfpId(rfpId);

        if(options == null) {
            throw new NotFoundException("No option(s) found")
                .withFields(
                    field("rfp_id", rfpId)
                );
        }

        return OptionMapper.optionsToDTOs(options);
    }
}
