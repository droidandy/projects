import useVerifyReceipt from "../../components/sections/AppleReceiptChecker/hooks/useVerifyReceipt";

export default async function verifyReceipt(req, res) {
    try {
        if (req.method === "POST") {
            const body = JSON.parse(req.body);
            const [data, errors] = await useVerifyReceipt(body, false);
            if (errors) {
                throw new Error(errors?.message);
            }
            if ([21007].indexOf(parseInt(data?.status,10)) !== -1) {
                const [data, errors] = await useVerifyReceipt(body, true);
                if (errors) {
                    throw new Error(errors?.message);
                }
                res.status(200).json(data);
                return true;
            }
            res.status(200).json(data);
        } else {
            throw new Error("Unsupported method");
        }
    }catch (e) {
        res.status(400).json({ message: e.message });
    }
}
