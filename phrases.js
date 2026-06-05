window.PHRASE_APP_DATA = {
  places: [
    { id: 'restaurant', ko: '음식점', icon: '🍜', description: '자리, 주문, 추가 요청, 계산' },
    { id: 'izakaya', ko: '술집/이자카야', icon: '🍺', description: '술·안주 주문, 추천, 계산' },
    { id: 'shop', ko: '편의점/가게', icon: '🛍️', description: '상품 찾기, 봉투, 결제, 영수증' },
    { id: 'taxi', ko: '택시/이동', icon: '🚕', description: '목적지, 정차, 결제, 영수증' },
    { id: 'lodging', ko: '숙소 정보', icon: '🏨', description: '호텔명, 주소, 택시용 문구' },
    { id: 'emergency', ko: '비상 표현', icon: '🆘', description: '알레르기, 병원, 도움 요청' }
  ],
  phraseTemplates: [
    {
      id: 'restaurant_people', place: 'restaurant', situation: '입장/자리', title: '인원 말하기',
      koTemplate: '{people}입니다.', jaTemplate: '{people}です。', pronunciationTemplate: '{peoplePron} 데스',
      slots: [{ key: 'people', label: '인원', options: [
        ['1명', '1名', '히토리'], ['2명', '2名', '후타리'], ['3명', '3名', '산닌'], ['4명', '4名', '요닌'], ['5명', '5名', '고닌']
      ]}]
    },
    {
      id: 'restaurant_table', place: 'restaurant', situation: '입장/자리', title: '자리 요청',
      koTemplate: '{seat} 있나요?', jaTemplate: '{seat}はありますか？', pronunciationTemplate: '{seatPron}와 아리마스카',
      slots: [{ key: 'seat', label: '자리', options: [
        ['자리', '席', '세키'], ['금연석', '禁煙席', '킨엔세키'], ['창가 자리', '窓側の席', '마도가와노 세키'], ['조용한 자리', '静かな席', '시즈카나 세키']
      ]}]
    },
    {
      id: 'restaurant_order_qty', place: 'restaurant', situation: '주문하기', title: '음식 주문',
      koTemplate: '{item} {quantity} 주세요.', jaTemplate: '{item}を{quantity}ください。', pronunciationTemplate: '{itemPron}오 {quantityPron} 쿠다사이',
      slots: [
        { key: 'item', label: '메뉴', options: [
          ['라멘', 'ラーメン', '라-멘'], ['우동', 'うどん', '우동'], ['돈카츠', 'とんかつ', '톤카츠'], ['카레', 'カレー', '카레-'], ['교자', '餃子', '교-자'], ['밥', 'ご飯', '고항'], ['물', '水', '미즈']
        ]},
        { key: 'quantity', label: '수량', options: [
          ['1개', '1つ', '히토츠'], ['2개', '2つ', '후타츠'], ['3개', '3つ', '밋츠'], ['4개', '4つ', '욧츠'], ['1잔', '1杯', '잇파이'], ['2잔', '2杯', '니하이']
        ]}
      ]
    },
    {
      id: 'restaurant_modifier', place: 'restaurant', situation: '추가 요청', title: '빼거나 조절하기',
      koTemplate: '{thing} {request}.', jaTemplate: '{thing}を{request}。', pronunciationTemplate: '{thingPron}오 {requestPron}',
      slots: [
        { key: 'thing', label: '대상', options: [
          ['파', 'ネギ', '네기'], ['마늘', 'ニンニク', '닌니쿠'], ['고수', 'パクチー', '파쿠치-'], ['고기', '肉', '니쿠'], ['매운맛', '辛さ', '카라사'], ['소스', 'ソース', '소-스']
        ]},
        { key: 'request', label: '요청', options: [
          ['빼주세요', '抜いてください', '누이테 쿠다사이'], ['적게 해주세요', '少なめにしてください', '스쿠나메니 시테 쿠다사이'], ['많이 주세요', '多めにしてください', '오오메니 시테 쿠다사이'], ['따로 주세요', '別にしてください', '베츠니 시테 쿠다사이']
        ]}
      ]
    },
    {
      id: 'restaurant_pay', place: 'restaurant', situation: '계산하기', title: '계산/결제',
      koTemplate: '{payment}.', jaTemplate: '{payment}。', pronunciationTemplate: '{paymentPron}',
      slots: [{ key: 'payment', label: '계산 표현', options: [
        ['계산해주세요', 'お会計お願いします', '오카이케- 오네가이시마스'], ['카드 되나요?', 'カードは使えますか？', '카-도와 츠카에마스카'], ['카드로 계산할게요', 'カードで払います', '카-도데 하라이마스'], ['영수증 주세요', '領収書をください', '료-슈-쇼오 쿠다사이'], ['따로 계산할 수 있나요?', '別々に払えますか？', '베츠베츠니 하라에마스카']
      ]}]
    },
    {
      id: 'izakaya_people', place: 'izakaya', situation: '입장하기', title: '인원 말하기',
      koTemplate: '{people}입니다.', jaTemplate: '{people}です。', pronunciationTemplate: '{peoplePron} 데스',
      slots: [{ key: 'people', label: '인원', options: [
        ['1명', '1名', '히토리'], ['2명', '2名', '후타리'], ['3명', '3名', '산닌'], ['4명', '4名', '요닌'], ['6명', '6名', '로쿠닌']
      ]}]
    },
    {
      id: 'izakaya_drink_qty', place: 'izakaya', situation: '술 주문', title: '술 주문',
      koTemplate: '{item} {quantity} 주세요.', jaTemplate: '{item}を{quantity}ください。', pronunciationTemplate: '{itemPron}오 {quantityPron} 쿠다사이',
      slots: [
        { key: 'item', label: '술/음료', options: [
          ['맥주', 'ビール', '비-루'], ['생맥주', '生ビール', '나마비-루'], ['하이볼', 'ハイボール', '하이보-루'], ['사케', '日本酒', '니혼슈'], ['소주', '焼酎', '쇼-츄-'], ['물', '水', '미즈'], ['우롱차', 'ウーロン茶', '우-론차']
        ]},
        { key: 'quantity', label: '수량', options: [
          ['1잔', '1杯', '잇파이'], ['2잔', '2杯', '니하이'], ['3잔', '3杯', '산바이'], ['4잔', '4杯', '욘하이'], ['1병', '1本', '잇폰'], ['2병', '2本', '니혼']
        ]}
      ]
    },
    {
      id: 'izakaya_food_qty', place: 'izakaya', situation: '안주 주문', title: '안주 주문',
      koTemplate: '{item} {quantity} 주세요.', jaTemplate: '{item}を{quantity}ください。', pronunciationTemplate: '{itemPron}오 {quantityPron} 쿠다사이',
      slots: [
        { key: 'item', label: '안주', options: [
          ['가라아게', '唐揚げ', '카라아게'], ['야키토리', '焼き鳥', '야키토리'], ['감자튀김', 'フライドポテト', '후라이도 포테토'], ['에다마메', '枝豆', '에다마메'], ['사시미', '刺身', '사시미'], ['오코노미야키', 'お好み焼き', '오코노미야키']
        ]},
        { key: 'quantity', label: '수량', options: [
          ['1개', '1つ', '히토츠'], ['2개', '2つ', '후타츠'], ['3개', '3つ', '밋츠'], ['하나 더', 'もう1つ', '모- 히토츠']
        ]}
      ]
    },
    {
      id: 'izakaya_recommend', place: 'izakaya', situation: '추천 요청', title: '추천받기',
      koTemplate: '{target} 추천해주세요.', jaTemplate: '{target}のおすすめを教えてください。', pronunciationTemplate: '{targetPron}노 오스스메오 오시에테 쿠다사이',
      slots: [{ key: 'target', label: '추천 대상', options: [
        ['안주', 'おつまみ', '오츠마미'], ['술', 'お酒', '오사케'], ['인기 메뉴', '人気メニュー', '닌키 메뉴-'], ['가게 추천 메뉴', 'お店のおすすめ', '오미세노 오스스메']
      ]}]
    },
    {
      id: 'izakaya_more', place: 'izakaya', situation: '추가 요청', title: '추가 요청',
      koTemplate: '{request}.', jaTemplate: '{request}。', pronunciationTemplate: '{requestPron}',
      slots: [{ key: 'request', label: '요청', options: [
        ['같은 걸로 하나 더 주세요', '同じものをもう1つください', '오나지 모노오 모- 히토츠 쿠다사이'], ['물 주세요', '水をください', '미즈오 쿠다사이'], ['얼음 많이 주세요', '氷を多めにください', '코오리오 오오메니 쿠다사이'], ['잔 주세요', 'グラスをください', '구라스오 쿠다사이'], ['메뉴판 주세요', 'メニューをください', '메뉴-오 쿠다사이']
      ]}]
    },
    {
      id: 'izakaya_modifier', place: 'izakaya', situation: '추가 요청', title: '빼거나 조절하기',
      koTemplate: '{thing} {request}.', jaTemplate: '{thing}を{request}。', pronunciationTemplate: '{thingPron}오 {requestPron}',
      slots: [
        { key: 'thing', label: '대상', options: [
          ['파', 'ネギ', '네기'], ['마늘', 'ニンニク', '닌니쿠'], ['고수', 'パクチー', '파쿠치-'], ['고기', '肉', '니쿠'], ['생선', '魚', '사카나'], ['소스', 'ソース', '소-스']
        ]},
        { key: 'request', label: '요청', options: [
          ['빼주세요', '抜いてください', '누이테 쿠다사이'], ['적게 해주세요', '少なめにしてください', '스쿠나메니 시테 쿠다사이'], ['따로 주세요', '別にしてください', '베츠니 시테 쿠다사이']
        ]}
      ]
    },
    {
      id: 'izakaya_pay', place: 'izakaya', situation: '계산하기', title: '계산/결제',
      koTemplate: '{payment}.', jaTemplate: '{payment}。', pronunciationTemplate: '{paymentPron}',
      slots: [{ key: 'payment', label: '계산 표현', options: [
        ['계산해주세요', 'お会計お願いします', '오카이케- 오네가이시마스'], ['카드 되나요?', 'カードは使えますか？', '카-도와 츠카에마스카'], ['카드로 계산할게요', 'カードで払います', '카-도데 하라이마스'], ['영수증 주세요', '領収書をください', '료-슈-쇼오 쿠다사이'], ['따로 계산할 수 있나요?', '別々に払えますか？', '베츠베츠니 하라에마스카']
      ]}]
    },
    {
      id: 'shop_find', place: 'shop', situation: '상품 찾기', title: '상품 위치 묻기',
      koTemplate: '{item} 어디 있나요?', jaTemplate: '{item}はどこにありますか？', pronunciationTemplate: '{itemPron}와 도코니 아리마스카',
      slots: [{ key: 'item', label: '상품', options: [
        ['물', '水', '미즈'], ['맥주', 'ビール', '비-루'], ['크리스피키스', 'クリスピーキッス', '쿠리스피- 킷스'], ['몽벨 포케터블 라이트백', 'モンベルのポケッタブルライトバッグ', '몬베루노 포켓타부루 라이토 박구'], ['우산', '傘', '카사'], ['휴대폰 충전기', 'スマホの充電器', '스마호노 쥬-덴키'], ['감기약', '風邪薬', '카제구스리'], ['화장실', 'トイレ', '토이레']
      ]}]
    },
    {
      id: 'shop_price', place: 'shop', situation: '가격 물어보기', title: '가격 묻기',
      koTemplate: '{item} 얼마예요?', jaTemplate: '{item}はいくらですか？', pronunciationTemplate: '{itemPron}와 이쿠라데스카',
      slots: [{ key: 'item', label: '상품', options: [
        ['이거', 'これ', '코레'], ['물', '水', '미즈'], ['맥주', 'ビール', '비-루'], ['크리스피키스', 'クリスピーキッス', '쿠리스피- 킷스'], ['몽벨 포케터블 라이트백', 'モンベルのポケッタブルライトバッグ', '몬베루노 포켓타부루 라이토 박구'], ['우산', '傘', '카사'], ['휴대폰 충전기', 'スマホの充電器', '스마호노 쥬-덴키']
      ]}]
    },
    {
      id: 'shop_pay', place: 'shop', situation: '구매/계산', title: '계산 요청',
      koTemplate: '{request}.', jaTemplate: '{request}。', pronunciationTemplate: '{requestPron}',
      slots: [{ key: 'request', label: '요청', options: [
        ['이것 주세요', 'これをください', '코레오 쿠다사이'], ['카드로 계산할게요', 'カードで払います', '카-도데 하라이마스'], ['현금으로 계산할게요', '現金で払います', '겐킨데 하라이마스'], ['영수증 주세요', 'レシートをください', '레시-토오 쿠다사이'], ['면세 되나요?', '免税できますか？', '멘제- 데키마스카']
      ]}]
    },
    {
      id: 'shop_bag', place: 'shop', situation: '봉투/포장', title: '봉투 요청',
      koTemplate: '{bag}.', jaTemplate: '{bag}。', pronunciationTemplate: '{bagPron}',
      slots: [{ key: 'bag', label: '봉투', options: [
        ['봉투 주세요', '袋をください', '후쿠로오 쿠다사이'], ['봉투 필요 없습니다', '袋はいりません', '후쿠로와 이리마센'], ['작은 봉투 주세요', '小さい袋をください', '치-사이 후쿠로오 쿠다사이'], ['포장해주세요', '包んでください', '츠츤데 쿠다사이']
      ]}]
    },
    {
      id: 'taxi_destination', place: 'taxi', situation: '목적지', title: '목적지 말하기',
      koTemplate: '{destination} 가주세요.', jaTemplate: '{destination}までお願いします。', pronunciationTemplate: '{destinationPron}마데 오네가이시마스',
      slots: [{ key: 'destination', label: '목적지', options: [
        ['여기', 'ここ', '코코'], ['이 주소', 'この住所', '코노 주-쇼'], ['호텔', 'ホテル', '호테루'], ['역', '駅', '에키'], ['공항', '空港', '쿠-코-'], ['이 장소', 'この場所', '코노 바쇼']
      ]}]
    },
    {
      id: 'taxi_stop', place: 'taxi', situation: '정차/길 안내', title: '정차 요청',
      koTemplate: '{request}.', jaTemplate: '{request}。', pronunciationTemplate: '{requestPron}',
      slots: [{ key: 'request', label: '요청', options: [
        ['여기서 세워주세요', 'ここで止めてください', '코코데 토메테 쿠다사이'], ['조금 천천히 가주세요', '少しゆっくり行ってください', '스코시 윳쿠리 잇테 쿠다사이'], ['저쪽으로 가주세요', 'あちらに行ってください', '아치라니 잇테 쿠다사이'], ['잠깐 기다려주세요', '少し待ってください', '스코시 맛테 쿠다사이']
      ]}]
    },
    {
      id: 'taxi_pay', place: 'taxi', situation: '결제하기', title: '택시 결제',
      koTemplate: '{payment}.', jaTemplate: '{payment}。', pronunciationTemplate: '{paymentPron}',
      slots: [{ key: 'payment', label: '결제', options: [
        ['카드로 계산할게요', 'カードで払います', '카-도데 하라이마스'], ['현금으로 계산할게요', '現金で払います', '겐킨데 하라이마스'], ['영수증 주세요', '領収書をください', '료-슈-쇼오 쿠다사이'], ['얼마인가요?', 'いくらですか？', '이쿠라데스카']
      ]}]
    },
    {
      id: 'lodging_name', place: 'lodging', situation: '호텔 정보', title: '호텔명',
      koTemplate: '호텔 오리엔탈 익스프레스 후쿠오카 나카스 카와바타입니다.',
      jaTemplate: 'ホテルオリエンタルエクスプレス福岡中洲川端です。',
      pronunciationTemplate: '호테루 오리엔타루 에쿠스푸레스 후쿠오카 나카스 카와바타 데스',
      slots: []
    },
    {
      id: 'lodging_address', place: 'lodging', situation: '호텔 정보', title: '주소',
      koTemplate: '주소: 〒812-0025 후쿠오카현 후쿠오카시 하카타구 텐야마치 6-26',
      jaTemplate: '〒812-0025 福岡県福岡市博多区店屋町6-26',
      pronunciationTemplate: '후쿠오카켄 후쿠오카시 하카타쿠 텐야마치 로쿠 노 니주로쿠',
      slots: []
    },
    {
      id: 'lodging_taxi', place: 'lodging', situation: '택시용', title: '택시 기사에게 보여주기',
      koTemplate: '호텔 오리엔탈 익스프레스 후쿠오카 나카스 카와바타까지 가주세요. 주소는 후쿠오카시 하카타구 텐야마치 6-26입니다.',
      jaTemplate: 'ホテルオリエンタルエクスプレス福岡中洲川端までお願いします。住所は福岡市博多区店屋町6-26です。',
      pronunciationTemplate: '호테루 오리엔타루 에쿠스푸레스 후쿠오카 나카스 카와바타마데 오네가이시마스. 주-쇼와 후쿠오카시 하카타쿠 텐야마치 로쿠 노 니주로쿠 데스',
      slots: []
    },
    {
      id: 'lodging_lost', place: 'lodging', situation: '길 묻기', title: '숙소 길 묻기',
      koTemplate: '호텔 오리엔탈 익스프레스 후쿠오카 나카스 카와바타에 가고 싶습니다. 길을 알려주세요.',
      jaTemplate: 'ホテルオリエンタルエクスプレス福岡中洲川端に行きたいです。道を教えてください。',
      pronunciationTemplate: '호테루 오리엔타루 에쿠스푸레스 후쿠오카 나카스 카와바타니 이키타이데스. 미치오 오시에테 쿠다사이',
      slots: []
    },
    {
      id: 'emergency_basic', place: 'emergency', situation: '도움 요청', title: '비상/곤란할 때',
      koTemplate: '{phrase}.', jaTemplate: '{phrase}。', pronunciationTemplate: '{phrasePron}',
      slots: [{ key: 'phrase', label: '표현', options: [
        ['일본어를 잘 못합니다', '日本語があまり話せません', '니혼고가 아마리 하나세마센'], ['한국어 가능한 직원이 있나요?', '韓国語ができるスタッフはいますか？', '칸코쿠고가 데키루 스탓후와 이마스카'], ['영어 가능하세요?', '英語はできますか？', '에-고와 데키마스카'], ['도와주세요', '助けてください', '타스케테 쿠다사이'], ['병원에 가야 합니다', '病院に行きたいです', '뵤-인니 이키타이데스'], ['알레르기가 있습니다', 'アレルギーがあります', '아레루기-가 아리마스'], ['택시를 불러주세요', 'タクシーを呼んでください', '타쿠시-오 욘데 쿠다사이']
      ]}]
    }
  ]
};
