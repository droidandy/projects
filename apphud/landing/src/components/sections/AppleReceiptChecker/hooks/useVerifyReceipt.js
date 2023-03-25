export default async function useVerifyReceipt(data, isSandbox = false) {
    const url = isSandbox
        ? "https://sandbox.itunes.apple.com/verifyReceipt"
        : "https://buy.itunes.apple.com/verifyReceipt"
    ;
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "receipt-data": data?.data,
                "password": data?.secret,
            })
        });
        return [
            await response.json(),
            null,
        ]
    } catch (e) {
        return [
            null,
            e
        ]
    }
}
