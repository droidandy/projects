package com.benrevo.core.service.pptx;

import static com.benrevo.common.enums.CarrierType.UHC;
import static com.benrevo.common.util.MapBuilder.field;

import com.benrevo.be.modules.shared.service.pptx.BasePptxPresentationService;
import com.benrevo.be.modules.shared.service.pptx.Data;
import com.benrevo.be.modules.shared.service.pptx.Option;
import com.benrevo.be.modules.shared.service.pptx.PptxGenerator;
import com.benrevo.be.modules.shared.service.pptx.Product;
import com.benrevo.common.Constants;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.util.MathUtils;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.repository.ClientRepository;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@AppCarrier(UHC)
@Transactional
public class UHCPptxPresentationService extends BasePptxPresentationService {

    @Autowired
    private ClientRepository clientRepository;

    @Override
    public byte[] getByClientId(Long clientId) {
        Client client = clientRepository.findOne(clientId);
        if(client == null) {
            throw new NotFoundException("Client not found")
                .withFields( field("client_id", clientId));
        }

        Map<String, Object> viewData = new HashMap<>();
        Data data = fillData(viewData, client, true);

        return PptxGenerator.generate("/templates/presentation.pptx", data, viewData, null);
    }

    @Override
    protected void fillDataForBars(Map<String, Object> viewData, Product product) {

        String prefix = product.prefix;
        Option alternative;
        if (product.renewalAlternatives.list.isEmpty() || product.renewalAlternatives.list.get(0) == null) {
            super.fillDataForBars(viewData, product);
            return;
        } else {
            alternative = product.renewalAlternatives.list.get(0);
        }
        List<Pair<String, Float>> options = new ArrayList<>();
        options.add(Pair.of("_current_bar", product.current.annualTotal));
        options.add(Pair.of("_renewal_bar", product.renewal.annualTotal));
        options.add(Pair.of("_alt_bar", alternative.annualTotal));
        options.sort((o1, o2) -> (int)(o1.getRight() - o2.getRight()));
        Pair<String, Float> min = options.get(0);
        Pair<String, Float> middle = options.get(1);
        Pair<String, Float> max = options.get(2);
        float denominator = Math.round(max.getRight() - min.getRight());
        //when all the total are equal, just use 0.5 as a bar width multiplier
        //otherwise, calculate the proportions
        viewData.put(prefix + min.getLeft(), denominator == 0f ? 0.5f : 0f);
        viewData.put(prefix + middle.getLeft(), denominator == 0f ? 0.5f : (middle.getRight() - min.getRight())/denominator);
        viewData.put(prefix + max.getLeft(), denominator == 0f ? 0.5f : (max.getRight() - min.getRight())/denominator);
    }

    @Override
    protected void fillAlternatives(Map<String, Object> viewData, Product product, Data data) {
        String prefix = product.prefix;
        if(!product.renewalAlternatives.list.isEmpty() && product.renewalAlternatives.list.get(0) != null) {
            Option alternative = product.renewalAlternatives.list.get(0);
            fillFinancialSummary(viewData, product, true, alternative, 0);
        } else {
            viewData.put(prefix + "bdohide", Pair.of(null, 0));//hide overview buy down option row
            if(!product.category.equals(Constants.MEDICAL) && !data.medical.renewalAlternatives.list
                .isEmpty() && !product.renewal.plans.isEmpty()) {
                fillFinancialSummary(viewData, product, true, product.renewal, 0);
        }
        }
        if (viewData.get(prefix + "hide") != null &&
            product.alternatives.list.stream().noneMatch(Objects::nonNull) &&
            product.renewalAlternatives.list.stream().noneMatch(Objects::nonNull))
        {
            viewData.put(prefix + "althide", Pair.of(null, 0));//hide row on alternative financial summary;
        }
    }

    @Override
    protected void fillProductOverviewAndMarketingSummary(
        Product product, String brokerName, Map<String, Object> viewData, String customProductCaption
    ) {
        CarrierType carrierType = CarrierType.fromString(appCarrier[0]);
        String lowerCaseProductName = StringUtils.lowerCase(product.category);
        if(!product.renewalAlternatives.list.isEmpty() && product.renewalAlternatives.list.get(0) != null) {
            float diffBDO = MathUtils.diffPecent(product.renewalAlternatives.list.get(0).total,
                product.current.total, 1
            );
            String overview = String.format(
                "%s %s %s is %s. An additional %s is also offered which is %s %s current.",
                carrierType.displayName, customProductCaption != null
                                         ? customProductCaption
                                         : StringUtils.capitalize(lowerCaseProductName),
                product.isRenewal ? "renewal" : "New Business Option 1",
                MathUtils.diffPecent(product.renewal.total, product.current.total, 1) + "%",
                product.isRenewal ? "buy down option" : "New Business Option 2", diffBDO + "%",
                diffBDO < 0 ? "under" : "over"
            );
            viewData.put(lowerCaseProductName + "_overview", overview);
        } else {
            float diff =  MathUtils.diffPecent(product.renewal.total, product.current.total, 1);
            String overview =
                String.format("%s %s renewal is %s %s current.", carrierType.displayName,
                    customProductCaption != null
                    ? customProductCaption
                    : StringUtils.capitalize(lowerCaseProductName),
                    diff + "%",
                    diff < 0 ? "under" : "over"
                );
            viewData.put(lowerCaseProductName + "_overview", overview);
        }
        viewData.put(product.prefix + "ra", product.isRenewal ? "Renewal" : "New Business");
        viewData.put(product.prefix + "ran", product.isRenewal ? "Renewal" : "Option 1");
        viewData.put(product.prefix + "bdo", product.isRenewal ? "Buy down option" : "Option 2");
    }

    @Override
    protected void postFill(
        Map<String, Object> viewData, Data data
    ) {
        viewData.put("idc", "Integration discount");
        viewData.put("idct", "Integration discounts");
        viewData.put("tname", data.medical.isRenewal ? "Renewal" : "New Business");
        float discountTotal = data.products.stream()
            .filter(product -> !product.equals(data.volLife) && !product.equals(data.medical))
            .map(product -> product.renewal.discount)
            .reduce(0.0f, Float::sum);
        viewData.put("idt", currencyFormatter.format(discountTotal));
    }
}
