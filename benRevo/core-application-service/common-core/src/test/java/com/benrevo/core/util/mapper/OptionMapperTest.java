package com.benrevo.core.util.mapper;

import com.benrevo.common.dto.OptionDto;
import com.benrevo.data.persistence.entities.Option;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.mapper.OptionMapper;
import org.junit.Test;
import uk.co.jemos.podam.api.AbstractClassInfoStrategy;
import uk.co.jemos.podam.api.PodamFactory;
import uk.co.jemos.podam.api.PodamFactoryImpl;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;

public class OptionMapperTest {

    private PodamFactory podamFactory = new PodamFactoryImpl();

    public OptionMapperTest() {
    	AbstractClassInfoStrategy classInfoStrategy = new AbstractClassInfoStrategy() {};
		classInfoStrategy
		.addExcludedField(Option.class, "rfp")
		.addExcludedField(OptionDto.class, "rateType")
		.addExcludedField(OptionDto.class, "plans");
		podamFactory.setClassStrategy(classInfoStrategy);
    }

    @Test
    public void testOptionsToDTOs() throws Exception {
        List<Option> options = new ArrayList<>();
        options.add(podamFactory.manufacturePojo(Option.class));
        options.add(podamFactory.manufacturePojo(Option.class));
        RFP rfp = new RFP();
        rfp.setRfpId(1L);
        options.get(0).setRfp(rfp);
        options.get(1).setRfp(rfp);
        List<OptionDto> optionDtos = OptionMapper.optionsToDTOs(options);
        assertEquals(options.size(), optionDtos.size());
        assertEquals(options.get(0).getCensusTier1(), optionDtos.get(0).getTier1Census());
        assertEquals(options.get(0).getCensusTier4(), optionDtos.get(0).getTier4Census());
        assertEquals(options.get(0).getRfp().getRfpId(), optionDtos.get(0).getRfpId());
    }

    @Test
    public void testDtosToOptions() throws Exception {
        List<OptionDto> optionDtos = new ArrayList<>();
        optionDtos.add(podamFactory.manufacturePojo(OptionDto.class));
        optionDtos.add(podamFactory.manufacturePojo(OptionDto.class));
        List<Option> options = OptionMapper.dtosToOptions(optionDtos);
        assertEquals(optionDtos.size(), options.size());
        assertEquals(optionDtos.get(0).getTier1Census(), options.get(0).getCensusTier1());
        assertEquals(optionDtos.get(0).getTier4Census(), options.get(0).getCensusTier4());
        assertEquals(optionDtos.get(0).getRfpId(), options.get(0).getRfp().getRfpId());
    }

    @Test
    public void testOptionToDTO() throws Exception {
        Option option = podamFactory.manufacturePojo(Option.class);
        RFP rfp = new RFP();
        rfp.setRfpId(1L);
        option.setRfp(rfp);
        OptionDto optionDto = OptionMapper.optionToDTO(option);
        assertEquals(option.getCensusTier1(), optionDto.getTier1Census());
        assertEquals(option.getCensusTier4(), optionDto.getTier4Census());
        assertEquals(option.getRfp().getRfpId(), optionDto.getRfpId());
        assertEquals(option.getId(), optionDto.getId());
        assertEquals(option.getAltRequest(), optionDto.getAltRequest());
    }

    @Test
    public void testDtoToOption() throws Exception {
        OptionDto optionDto = podamFactory.manufacturePojo(OptionDto.class);
        Option option = OptionMapper.dtoToOption(optionDto);
        assertEquals(optionDto.getTier1Census(), option.getCensusTier1());
        assertEquals(optionDto.getTier4Census(), option.getCensusTier4());
        assertEquals(optionDto.getRfpId(), option.getRfp().getRfpId());
        assertEquals(optionDto.getId(), option.getId());
        assertEquals(optionDto.getAltRequest(), option.getAltRequest());
    }

}
