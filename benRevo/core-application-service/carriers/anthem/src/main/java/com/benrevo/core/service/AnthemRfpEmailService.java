package com.benrevo.core.service;

import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;
import static com.benrevo.common.util.StreamUtils.mapToMap;
import static java.util.Collections.singletonList;
import static org.apache.commons.lang3.StringUtils.isNotBlank;

import com.benrevo.be.modules.rfp.service.RfpEmailService;
import com.benrevo.be.modules.rfp.service.anthem.AnthemOptimizerProcessor;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.dto.AttachmentDto;
import com.benrevo.common.dto.ClientDto;
import com.benrevo.common.dto.FileDto;
import com.benrevo.common.exception.BaseException;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AppCarrier(ANTHEM_BLUE_CROSS)
@Transactional
public class AnthemRfpEmailService extends RfpEmailService {

    @Autowired
    private AnthemOptimizerProcessor anthemOptimizerProcessor;

    protected static String ANTHEM_OPTIMIZER_TEMPLATE = "/2018 Optimizer v33_template.xlsm";

    public AnthemRfpEmailService() {
        appCarrier = new String[]{ ANTHEM_BLUE_CROSS.name() };
    }

    @Override
    protected List<FileDto> addAdditionalFilesToCarrier(List<FileDto> fileAttachments, ClientDto clientDto, List<Long> rfpIds) {
        // make deep copy
        List<FileDto> newFileAttachments = new ArrayList<>(fileAttachments);

        // add optimizer file
        FileDto fileDto = new FileDto();
        fileDto.setName(clientDto.getClientName() + "_Optimizer.xlsm");
        fileDto.setContent(anthemOptimizerProcessor.build(getPrefix() + ANTHEM_OPTIMIZER_TEMPLATE, clientDto.getId(), rfpIds));
        newFileAttachments.add(fileDto);
        return newFileAttachments;
    }

    @Override
    protected List<AttachmentDto> buildAttachments(List<FileDto> fileAttachments, String partSuffix) {
        try(ByteArrayOutputStream out = new ByteArrayOutputStream();
            ZipOutputStream zip = new ZipOutputStream(out)) {

            Map<String, FileDto> uniqueFiles = mapToMap(fileAttachments, FileDto::getName, x -> x);
            
            for (FileDto sourceFile : uniqueFiles.values()) {
                zip.putNextEntry(new ZipEntry(sourceFile.getName()));
                zip.write(sourceFile.getContent(), 0, sourceFile.getContent().length);
                zip.closeEntry();
            }
            zip.close();

            String filename = isNotBlank(partSuffix)
                ? "rfp-submission" + partSuffix + ".zip"
                : "rfp-submission.zip";

            return singletonList( new AttachmentDto(filename, out.toByteArray() ) );
            
        } catch (Exception e) {
            throw new BaseException(e.getMessage(), e);
        }
    }

}
