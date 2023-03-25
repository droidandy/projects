import { ElementCompact } from "xml-js";

export interface UspsAddressResponse extends ElementCompact {
    AddressValidateResponse: AddressValidateResponse
}

interface AddressValidateResponse extends ElementCompact {
    Address: Address;
}

interface Address extends ElementCompact {
    Error?: Error;

    Address1?: ElementCompact;
    Address2?: ElementCompact;
    City?: ElementCompact;
    State?: ElementCompact;
    Zip5?: ElementCompact;
    Zip4?: ElementCompact;
}

interface Error extends ElementCompact {
    Number?: ElementCompact;
    Source?: ElementCompact;
    Description?: ElementCompact;
}