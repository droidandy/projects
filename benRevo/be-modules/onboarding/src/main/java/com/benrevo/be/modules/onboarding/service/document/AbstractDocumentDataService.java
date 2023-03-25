package com.benrevo.be.modules.onboarding.service.document;

import com.benrevo.data.persistence.entities.Client;
import java.text.DecimalFormat;
import java.util.Map;
import org.apache.commons.lang3.math.NumberUtils;

public abstract class AbstractDocumentDataService {

    private static final int MAX_CONTACT_COUNT = 5;
    
    protected DecimalFormat amountFormat = new DecimalFormat("#0.00");

    protected abstract Map<String, String> getData(Client client);

    protected void addGeneralInformation(Client client, Map<String, String> answers) {
        answers.put("general_information_address", format(client.getAddress()));
        answers.put("general_information_city", format(client.getCity()));
        answers.put("general_information_state", format(client.getState()));
        answers.put("general_information_zip_code", format(client.getZip()));
    }

    protected static String format(Object value) {
        return value != null ? value.toString() : "";
    }

    /**
     * Transforms nameless answers to named ones to use in templates.
     * e.g. "contact_name_1" with "contact_role_1_1"="Group Administrator" and "contact_role_1_2"="Billing Contact" 
     * will be transformed to two answers "Group Administrator_name" and "Billing Contact_name".
     *
     * @param answers 
     *     Map with nameless answers
     */
    protected void transformContactInformation(Map<String, String> answers) {
        
        int contactCounter = NumberUtils.toInt(answers.remove("contact_counter"), 0);
        
        for (int i=1;i<=MAX_CONTACT_COUNT;i++) {
            String name = answers.remove("contact_name_"+i);
            String email = answers.remove("contact_email_"+i);
            String phone = answers.remove("contact_phone_"+i);
            String fax = answers.remove("contact_fax_"+i);
            String state = answers.remove("contact_state_"+i);
            String city = answers.remove("contact_city_"+i);
            String address = answers.remove("contact_address_"+i);
            String zip = answers.remove("contact_zip_"+i);
            String title = answers.remove("contact_title_"+i);
            String emailType = answers.remove("contact_email_type_"+i);
            String userIs = answers.remove("contact_user_is_"+i);
            String role_prefix = "contact_role_"+i+"_";
            if (contactCounter >= i) { // skip unused answers
                for (int j=1;j<=MAX_CONTACT_COUNT;j++) {
                    String role = answers.remove(role_prefix+j);
                    if (role != null) {
                        if (name != null) { answers.put(role+"_name", name); }
                        if (email != null) { answers.put(role+"_email", email); }
                        if (phone != null) { answers.put(role+"_phone", phone); }
                        if (fax != null) { answers.put(role+"_fax", fax); }
                        if (state != null) { answers.put(role+"_state", state); }
                        if (city != null) { answers.put(role+"_city", city); }
                        if (address != null) { answers.put(role+"_address", address); }
                        if (zip != null) { answers.put(role+"_zip", zip); }
                        if (title != null) { answers.put(role+"_title", title); }
                        if (emailType != null) { answers.put(role+"_email_type", emailType); }
                        if (userIs != null) { answers.put(role+"_user_is", userIs); }
                    }
                }
            }
        }
    }


}
