#!/bin/sh
GOOGLEMAPS_TEMP="null"
API_TEMP="local"

usage()
{
    echo "Inserts values and secrets to for the build process."
    echo ""
    echo "\t-h --help"
    echo "\t--api API DNS host. Use local, web, or app."
    echo "\t--googlemaps Google Maps API key secret."
    echo ""
}

while [ "$1" != "" ]; do
    PARAM=`echo $1 | awk -F= '{print $1}'`
    VALUE=`echo $1 | awk -F= '{print $2}'`
    case $PARAM in
        -h | --help)
            usage
            exit
            ;;
        --api)
            API_TEMP=$VALUE
            ;;
        --googlemaps)
            GOOGLEMAPS_TEMP=$VALUE
            ;;
        *)
            echo "ERROR: unknown parameter \"$PARAM\""
            usage
            exit 1
            ;;
    esac
    shift
done

# Export local env variable for use with node / webpack process.env
export GOOGLEMAPS_SECRET=$GOOGLEMAPS_TEMP
export API_HOST=$API_TEMP

npm run build