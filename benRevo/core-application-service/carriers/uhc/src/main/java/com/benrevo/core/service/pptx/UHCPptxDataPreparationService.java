package com.benrevo.core.service.pptx;

import static com.benrevo.common.enums.CarrierType.UHC;

import com.benrevo.be.modules.shared.service.SharedRfpQuoteService;
import com.benrevo.be.modules.shared.service.pptx.BasePptxDataPreparationService;
import com.benrevo.be.modules.shared.service.pptx.Data;
import com.benrevo.be.modules.shared.service.pptx.Option;
import com.benrevo.be.modules.shared.service.pptx.Product;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.OptionType;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientExtProduct;
import com.benrevo.data.persistence.entities.QuoteOption;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.repository.ClientExtProductRepository;
import java.util.List;
import java.util.Optional;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@AppCarrier(UHC)
@Transactional
public class UHCPptxDataPreparationService extends BasePptxDataPreparationService {


    @Autowired
    protected ClientExtProductRepository clientExtProductRepository;

    @Override
    protected void fillDataExcludeCurrent(Data data, Client client) {

        RfpQuoteOption medicalOption = prepareMedicalCarrierRenewal(data, client.getClientId());
        boolean isValidAppCarrierOption = sharedRfpQuoteService.isValidAppCarrierOption(medicalOption);
        prepareCarrierRenewal(data.dental, client.getClientId(), data, isValidAppCarrierOption);
        prepareCarrierRenewal(data.vision, client.getClientId(), data, isValidAppCarrierOption);

        prepareCarrierAncillaryRenewal(data.life, client.getClientId(), data, isValidAppCarrierOption);
        prepareCarrierAncillaryRenewal(data.volLife, client.getClientId(), data, isValidAppCarrierOption);
        prepareCarrierAncillaryRenewal(data.std, client.getClientId(), data, isValidAppCarrierOption);
        prepareCarrierAncillaryRenewal(data.ltd, client.getClientId(), data, isValidAppCarrierOption);

        RfpQuoteOption medicalOption2 = prepareCarrierMedicalAlternative(data, client.getClientId());
        if (!data.medical.renewalAlternatives.list.isEmpty()) {
            boolean isValidAppCarrierOption2 = sharedRfpQuoteService.isValidAppCarrierOption(medicalOption2);
            float medicalTotal2 = data.medical.renewalAlternatives.list.get(0).annualTotal;
            prepareCarrierAlternative(data.dental, client.getClientId(), isValidAppCarrierOption2, data, medicalTotal2);
            prepareCarrierAlternative(data.vision, client.getClientId(), isValidAppCarrierOption2, data, medicalTotal2);

            prepareCarrierAncillaryAlternative(data.life, client.getClientId(), isValidAppCarrierOption2, medicalTotal2);
            //prepareCarrierAncillaryAlternative(data.volLife, client.getClientId(), isRenewal, isValidAppCarrierOption2, medicalTotal2);
            prepareCarrierAncillaryAlternative(data.std, client.getClientId(), isValidAppCarrierOption2, medicalTotal2);
            prepareCarrierAncillaryAlternative(data.ltd, client.getClientId(), isValidAppCarrierOption2, medicalTotal2);
            data.products.forEach(product -> {
                product.alternatives.list.add(null);
                if (product.renewalAlternatives.list.isEmpty()) {
                    product.renewalAlternatives.list.add(null);
                }
            });
        }
    }

    private RfpQuoteOption prepareMedicalCarrierRenewal(Data data, Long clientId) {
        Product product = data.medical;
        String category = product.category;
        Option option = product.renewal;

        Optional<RfpQuoteOption>
            optional = rfpQuoteOptionRepository.findByClientIdAndCategory(clientId, category)
            .stream()
            .filter(o -> StringUtils.equalsIgnoreCase(o.getRfpQuoteOptionName(), "Renewal")
                || StringUtils.equalsIgnoreCase(o.getRfpQuoteOptionName(), "Renewal 1")
                || StringUtils.equalsIgnoreCase(o.getRfpQuoteOptionName(), "Option 1")
            ).findFirst();
        optional.ifPresent(rfpQuoteOption -> {
            prepareRenewalOption(rfpQuoteOption, option, product);
            prepareCommonRenewalCarrier(product, rfpQuoteOption, option);
        });
        return optional.orElse(null);
    }

    private void prepareCarrierRenewal(Product product, Long clientId, Data data,
        boolean isValidAppCarrierOption
    ) {
        String category = product.category;
        Option option = product.renewal;

        rfpQuoteOptionRepository.findByClientIdAndCategory(clientId, category)
            .stream()
            .filter(o -> StringUtils.equalsIgnoreCase(o.getRfpQuoteOptionName(), "Renewal")
                || StringUtils.equalsIgnoreCase(o.getRfpQuoteOptionName(), "Renewal 1")
                || StringUtils.equalsIgnoreCase(o.getRfpQuoteOptionName(), "Option 1")
            ).findFirst()
            .ifPresent(renewal -> {
                prepareRenewalOption(renewal, option, product);
                prepareCommonRenewalCarrier(product, renewal, option);
                if (isValidAppCarrierOption) {
                    Optional.ofNullable(sharedRfpQuoteService.checkAndReturnCarrierBundlingDiscount(
                        renewal,
                        SharedRfpQuoteService.CV_PRODUCT_DISCOUNT_PERCENT.get(product.category),
                        data.medical.isRenewal
                    )).ifPresent(discountPercent -> option.discountPercent = discountPercent);;
                    option.discount = data.medical.renewal.annualTotal * option.discountPercent;
                }
            });
    }

    private void prepareCarrierAncillaryAlternative(Product product, Long clientId,
         boolean isValidAppCarrierOption, float medicalTotal
    ) {
        String category = product.category;
        boolean isRenewal = product.isRenewal;
        String searchName = isRenewal ? "Renewal 2" : "Option 2";
        String optionName = isRenewal ? "Renewal 2" : "New Business 2";
        rfpQuoteRepository.findByClientIdAndCategoryAndQuoteType(clientId, category, QuoteType.STANDARD)
            .stream()
            .flatMap(q -> rfpQuoteAncillaryOptionRepository.findByRfpQuote(q).stream())
            .filter(o -> StringUtils.equalsIgnoreCase(o.getName(), searchName))
            .findFirst()
            .ifPresent(ancillaryOption -> {
                Option option = prepareAlternativeAncillaryOption(product, optionName, ancillaryOption);
                prepareCarrierAncillaryDiscount(product, clientId, isValidAppCarrierOption,
                    medicalTotal, option);
                product.renewalAlternatives.list.add(option);
            });
    }

    private void prepareCarrierAncillaryRenewal(Product product, Long clientId,
        Data data, boolean isValidAppCarrierOption
    ) {
        String category = product.category;
        Option option = product.renewal;


        PlanCategory planCategory = PlanCategory.valueOf(category);

        rfpQuoteRepository.findByClientIdAndCategoryAndQuoteType(clientId, category, QuoteType.STANDARD)
            .stream()
            .flatMap(q -> rfpQuoteAncillaryOptionRepository.findByRfpQuote(q).stream())
            .filter(o -> StringUtils.equalsIgnoreCase(o.getName(), "Renewal")
                || StringUtils.equalsIgnoreCase(o.getName(), "Renewal 1")
                || StringUtils.equalsIgnoreCase(o.getName(), "Option 1"))
            .findFirst()
            .ifPresent(renewal -> {
                prepareAncillaryRenewalOption(renewal, planCategory, product);
                prepareCommonRenewalCarrier(product, renewal, option);
                prepareCarrierAncillaryDiscount(product, clientId, isValidAppCarrierOption,
                    data.medical.renewal.annualTotal, option);
            });
    }

    private void prepareCommonRenewalCarrier(Product product, QuoteOption renewal, Option option) {
        product.isRenewal = product.isCarrierNameAppCarrier && SharedRfpQuoteService.getOptionType(
            renewal.getName()).equals(OptionType.RENEWAL);
        option.name = product.isRenewal ? "Renewal" : "New Business";
        Carrier carrier = renewal.getRfpQuote().getRfpSubmission().getRfpCarrier().getCarrier();
        option.carrierDisplayName = carrier.getDisplayName();
        if(QuoteType.KAISER.equals(renewal.getRfpQuote().getQuoteType())) {
            option.carrierDisplayName += " / " + CarrierType.KAISER.displayName;
        }
    }

    private void prepareCarrierAncillaryDiscount(Product product, Long clientId,
        boolean isValidAppCarrierOption, float medicalTotal, Option option) {
        if (isValidAppCarrierOption && !product.prefix.equals(Data.VOL_LIFE_PREFIX)) {
            List<ClientExtProduct> products = clientExtProductRepository.findByClientId(clientId);
            if(!products.isEmpty()) {
                for(ClientExtProduct clientProduct : products) {
                    if (clientProduct.getExtProduct().getName().equals(product.category)) {
                        option.discountPercent =
                            SharedRfpQuoteService.CV_PRODUCT_DISCOUNT_PERCENT.getOrDefault(
                                clientProduct.getExtProduct().getName(), 0f);
                        option.discount = medicalTotal * option.discountPercent;
                        break;
                    }
                }
            }
        }
    }

    private RfpQuoteOption prepareCarrierMedicalAlternative(Data data, Long clientId) {
        Product product = data.medical;
        String category = product.category;
        String searchName = product.isRenewal ? "Renewal 2" : "Option 2";
        String optionName = product.isRenewal ? "Renewal 2" : "New Business 2";
        Optional<RfpQuoteOption> optional = rfpQuoteOptionRepository.findByClientIdAndCategory(clientId, category)
            .stream()
            .filter(o -> StringUtils.equalsIgnoreCase(o.getRfpQuoteOptionName(), searchName))
            .findFirst();
        optional.ifPresent(quoteOption -> {
            Option option = prepareAlternativeOption(product, optionName,
                quoteOption, null);
            product.renewalAlternatives.list.add(option);
        });
        return optional.orElse(null);
    }

    private void prepareCarrierAlternative(Product product, Long clientId,
        boolean isValidAppCarrierOption, Data data, float medicalTotal
    ) {
        String category = product.category;
        boolean isRenewal = product.isRenewal;
        String searchName = isRenewal ? "Renewal 2" : "Option 2";
        String optionName = isRenewal ? "Renewal 2" : "New Business 2";

        rfpQuoteOptionRepository.findByClientIdAndCategory(clientId, category)
            .stream()
            .filter(o -> StringUtils.equalsIgnoreCase(o.getRfpQuoteOptionName(), searchName))
            .findFirst()
            .ifPresent(quoteOption -> {
                Option option = prepareAlternativeOption(product, optionName,
                    quoteOption, null);
                if (isValidAppCarrierOption) {
                    Optional.ofNullable(sharedRfpQuoteService.checkAndReturnCarrierBundlingDiscount(
                        quoteOption,
                        SharedRfpQuoteService.CV_PRODUCT_DISCOUNT_PERCENT.get(product.category),
                        data.medical.isRenewal
                    )).ifPresent(discountPercent -> option.discountPercent = discountPercent);
                    option.discount = medicalTotal * option.discountPercent;
                }
                product.renewalAlternatives.list.add(option);
            });
    }

}
