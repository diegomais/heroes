HOST=localhost:3333

echo '\n\n creating Captain America'
CREATE=$(
curl --silent -X POST \
    --header "Content-Type: application/json" \
    --data-binary '{"name":"Captain America","power":"Leadership and sense of duty"}' \
    $HOST/heroes
)

echo $CREATE | jq

ID=$(echo $CREATE | jq .id)

echo "\n\n requesting Captain America $ID"
curl --silent $HOST/heroes/$ID | jq

echo '\n\n requesting all heroes'
curl --silent $HOST/heroes | jq

echo "\n\n updating Captain America $ID"
curl --silent -X PUT \
    --header "Content-Type: application/json" \
    --data-binary '{"name":"Batman","power":"Rich"}' \
    $HOST/heroes/$ID \
    | jq

echo "\n\n requesting id: $ID"
curl --silent $HOST/heroes/$ID | jq

echo "\n\n removing id: $ID"
curl --silent -X DELETE \
    --header "Content-Type: application/json" \
    $HOST/heroes/$ID \
    | jq

echo '\n\n requesting all heroes'
curl --silent $HOST/heroes | jq