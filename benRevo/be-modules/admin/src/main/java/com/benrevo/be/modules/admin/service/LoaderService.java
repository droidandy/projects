package com.benrevo.be.modules.admin.service;

import com.benrevo.be.modules.admin.domain.plans.FormattedPlanPortfolioLoader;
import com.benrevo.be.modules.admin.domain.plans.GenericPlanDetails;
import com.benrevo.be.modules.admin.domain.plans.ProgramPlanLoader;
import com.benrevo.be.modules.admin.domain.quotes.BaseUploader;
import com.benrevo.be.modules.shared.service.S3FileManager;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.CarrierPlansPreviewDto;
import com.benrevo.common.dto.QuoteChangesDto;
import com.benrevo.common.dto.QuoteUploaderDto;
import com.benrevo.common.dto.RfpQuoteDto;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.common.exception.BadRequestException;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.repository.CarrierRepository;
import com.benrevo.data.persistence.repository.RfpCarrierRepository;
import com.benrevo.data.persistence.repository.RfpQuoteRepository;

import java.io.InputStream;
import java.time.Year;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;
import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.core.appender.rolling.FileExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import static com.benrevo.common.enums.CarrierType.validCarrier;
import static com.benrevo.common.util.MapBuilder.field;
import static java.util.Objects.isNull;
import static java.util.stream.Collectors.toList;
import static org.apache.commons.io.FilenameUtils.getExtension;
import static org.apache.commons.lang3.StringUtils.equalsAnyIgnoreCase;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.commons.lang3.StringUtils.split;

@Service
@Transactional
public class LoaderService {

    @Autowired
    private BaseUploader uploader;

    @Autowired
    private FormattedPlanPortfolioLoader planLoader;

    @Autowired
    private ProgramPlanLoader programPlanLoader;
    
    @Autowired
    private CarrierRepository carrierRepository;

    @Autowired
    private RfpCarrierRepository rfpCarrierRepository;

    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;
    
    @Autowired
    private S3FileManager s3FileManager;

    private final String[] ALLOWED_QUOTE_FILE_EXTENSIONS = new String[]{"xlsx", "xls", "xlsm", "pdf"};

    public RfpQuote getLatestQuote(String carrier, String clientId, String brokerId, QuoteType quoteType, String category){
        RfpCarrier rfpCarrier = rfpCarrierRepository.findByCarrierNameAndCategory(carrier, category);

        if(rfpCarrier == null){
            throw new NotFoundException("No RFP Carrier found")
                .withFields(
                    field("category", category),
                    field("carrier", carrier)
                );
        }

        if(!category.equals(Constants.MEDICAL) && quoteType == QuoteType.KAISER) {
            throw new IllegalArgumentException("Kaiser quotes are only applicable to the MEDICAL category.");
        }

        return rfpQuoteRepository.findByRfpSubmissionRfpCarrierRfpCarrierIdAndRfpSubmissionClientClientIdAndLatestAndQuoteType(rfpCarrier.getRfpCarrierId(), Math.round(Double.valueOf(clientId)), true, quoteType);
    }

    private void validateQuoteFileTypes(List<MultipartFile> files) throws Exception {
        for(MultipartFile file : files){
            if(file != null) {
                String fileExtension = getExtension(file.getOriginalFilename());
                boolean isAllowed = equalsAnyIgnoreCase(fileExtension, ALLOWED_QUOTE_FILE_EXTENSIONS);

                if (!isAllowed) {
                    throw new BaseException("Quote file with name '"
                        + file.getOriginalFilename() + "' is not an '" +
                        StringUtils.join(ALLOWED_QUOTE_FILE_EXTENSIONS, ", ")
                        + fileExtension + "' is not allowed.");
                }
            }
        }
    }

    public QuoteUploaderDto validateQuotes(List<MultipartFile> files, String clientId, String brokerId) throws Exception {
        validateQuoteFileTypes(files);
        return uploader.validate(files, Math.round(Double.valueOf(clientId)), Math.round(Double.valueOf(brokerId)));
    }

    public List<RfpQuoteDto> uploadQuotes(List<MultipartFile> files, String clientId, String brokerId, QuoteUploaderDto dto) throws Exception {
        validateQuoteFileTypes(files);
        List<RfpQuote> quotes = uploader.run(files, Math.round(Double.valueOf(clientId)), Math.round(Double.valueOf(brokerId)), dto, false, true);

        if(isNull(quotes)) return null;

        return quotes.stream()
            .map(q -> getRfpQuoteDto(q.getQuoteType(), q))
            .collect(toList());
    }

    public RfpQuote uploadQuote(MultipartFile file, List<MultipartFile> file2List, String carrier,
        String clientId, String brokerId, QuoteType quoteType, String category,
        Boolean isRenewal) throws Exception{

        validateQuoteFileTypes(
            !isNull(file2List) ? Stream.concat(file2List.stream(), Stream.of(file)).collect(toList())
                : Arrays.asList(file));

        InputStream stream = file == null ? null : file.getInputStream();
        List<InputStream> stream2List = new ArrayList<>(file2List.size());
        for(MultipartFile file2 : file2List) {
            stream2List.add(file2.getInputStream());
        }

        RfpQuote rfpQuote = uploader.run(stream, stream2List, Math.round(Double.valueOf(clientId)),
            Math.round(Double.valueOf(brokerId)), quoteType, category, isRenewal, false);

        if(file != null && !isNull(rfpQuote)){
            String key = s3FileManager.uploadQuote(
                file.getOriginalFilename(),
                file.getInputStream(),
                file.getContentType(),
                file.getSize(),
                CarrierType.valueOf(carrier)
            );

            rfpQuote.setS3Key(key);
            rfpQuote = rfpQuoteRepository.save(rfpQuote);
        }
        
        return rfpQuote;
    }

    public QuoteChangesDto getQuoteChanges(MultipartFile file, List<MultipartFile> file2List,
        String carrier, Long clientId, Long brokerId, QuoteType quoteType, String category, boolean isRenewal) throws Exception {

        validateQuoteFileTypes(
            !isNull(file2List) ? Stream.concat(file2List.stream(), Stream.of(file)).collect(toList())
                : Arrays.asList(file));

        InputStream stream = file == null ? null : file.getInputStream();
        List<InputStream> stream2List = new ArrayList<>(file2List.size());
        for(MultipartFile file2 : file2List) {
            stream2List.add(file2.getInputStream());
        }

        return uploader.findChanges(stream, stream2List, clientId, brokerId, quoteType, category, isRenewal, false);
    }

    public CarrierPlansPreviewDto previewPlans(MultipartFile file, String carrierName, Integer planYear) throws Exception {
        if(file.isEmpty()) {
            throw new BadRequestException("Plan file is empty");
        }

        planYear = checkGetPlanYear(planYear);
        
        CarrierPlansPreviewDto result = null;

        if(validCarrier(carrierName)) {
            Carrier carrier = findCarrier(carrierName);

        	result = planLoader.previewPlans(carrier, file.getInputStream(), planYear);
        }

    	return result;
    }
    
    public void uploadPlans(MultipartFile file, String carrierName, String programName, Integer planYear) throws Exception {
        validateQuoteFileTypes(Arrays.asList(file));
    	Carrier carrier = findCarrier(carrierName);

        if(file.isEmpty()) {
            throw new BadRequestException("Plan file is empty");
        }

        planYear = checkGetPlanYear(planYear);

        if(validCarrier(carrierName) && !isBlank(programName)){
            // program plans
            programPlanLoader.savePlans(file.getInputStream(), carrier, programName, planYear);
        } else if(validCarrier(carrierName) && isBlank(programName)) {
        	Map<String, List<GenericPlanDetails>> parsedPlans = planLoader.parsePlans(carrier, file.getInputStream(), true);
            planLoader.savePlans(carrier, parsedPlans, planYear);
        }
    }
    
    private int checkGetPlanYear(Integer planYear) {
        if(planYear == null) {
            return Year.now().getValue();
        }
        if(planYear < Year.now().getValue()) {
            throw new BaseException("Unable to upload old plans for " + planYear + " year");
        }
        return planYear;
    }

    private Carrier findCarrier(String carrierName) {
        if(StringUtils.isBlank(carrierName)){
            throw new BadRequestException("Carrier name cannot be null or empty");
        }

        Carrier carrier = carrierRepository.findByName(carrierName);

        if(carrier == null || !validCarrier(carrierName)) {
            throw new NotFoundException("Carrier not found")
                .withFields(
                    field("carrier", carrier)
                );
        }

        return carrier;
    }

    public RfpQuoteDto getRfpQuoteDto(QuoteType quoteType, RfpQuote quote) {
        RfpQuoteDto dto = new RfpQuoteDto();
        dto.setQuoteType(quoteType);
        dto.setRfpQuoteId(quote.getRfpQuoteId());
        dto.setCategory(quote.getRfpSubmission().getRfpCarrier().getCategory());
        dto.setRatingTiers(quote.getRatingTiers());
        dto.setRfpQuoteId(quote.getRfpQuoteId());
        if(quote.getS3Key() != null){
            String fileName = split(quote.getS3Key(), "_", 2)[1];
            dto.setFileName(fileName);
        }
        return dto;
    }
}
