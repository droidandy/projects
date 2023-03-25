KEYSTORE=app.jks
PASSWORD=123456
ALIAS=iti.invest.mapp

echo Remove current ${KEYSTORE}
rm ${KEYSTORE}

echo Generating new keystore ...
echo Use keystore password: ${PASSWORD}

# keytool -genkey -v -keystore ${KEYSTORE} -keyalg RSA -keysize 2048 -validity 10000 -alias ${ALIAS} -keypasswd ${PASSWORD} -storepasswd ${PASSWORD}
keytool -genkey -v -keystore ${KEYSTORE} -keyalg RSA -keysize 2048 -validity 10000 -alias ${ALIAS}

# The JKS keystore uses a proprietary format. It is recommended to migrate to PKCS12 which is an industry standard format
keytool -importkeystore -srckeystore ${KEYSTORE} -destkeystore ${KEYSTORE} -deststoretype pkcs12
rm ${KEYSTORE}.old

# Tab
keytool -list -keystore ${KEYSTORE}
