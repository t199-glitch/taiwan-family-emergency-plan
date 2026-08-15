// 我的家庭安全避難計畫 - 台灣避難收容處所與防空處所示範資料 (Shelter Location Data)

import { EmergencyLocation } from '../types';

export const MOCK_EMERGENCY_LOCATIONS: EmergencyLocation[] = [
  // 台北市
  {
    id: 'loc_tp_1',
    name: '臺北市大安森林公園（開闊避難場域）',
    county: '臺北市',
    district: '大安區',
    address: '臺北市大安區新生南路二段1號',
    latitude: 25.0302,
    longitude: 121.5358,
    type: 'park',
    capacity: 10000,
    suitableHazards: ['earthquake', 'typhoon_flood'],
    phone: '02-2700-3881'
  },
  {
    id: 'loc_tp_2',
    name: '臺北市立建國高級中學避難收容處所',
    county: '臺北市',
    district: '中正區',
    address: '臺北市中正區南海路56號',
    latitude: 25.0315,
    longitude: 121.5126,
    type: 'shelter',
    capacity: 2500,
    suitableHazards: ['earthquake', 'typhoon_flood', 'tsunami'],
    phone: '02-2303-4381'
  },
  {
    id: 'loc_tp_3',
    name: '捷運大安站地下層（防空避難處所）',
    county: '臺北市',
    district: '大安區',
    address: '臺北市大安區信義路四段2號地下層',
    latitude: 25.0329,
    longitude: 121.5435,
    type: 'air_raid',
    capacity: 4000,
    suitableHazards: ['air_raid', 'military_crisis'],
    phone: '02-2181-2345'
  },

  // 台中市
  {
    id: 'loc_tc_1',
    name: '臺中市立臺中第一高級中等學校避難處所',
    county: '臺中市',
    district: '北區',
    address: '臺中市北區育才街2號',
    latitude: 24.1495,
    longitude: 120.6865,
    type: 'shelter',
    capacity: 3000,
    suitableHazards: ['earthquake', 'typhoon_flood'],
    phone: '04-2222-6081'
  },
  {
    id: 'loc_tc_2',
    name: '臺中文心森林公園避難綠地',
    county: '臺中市',
    district: '南屯區',
    address: '臺中市南屯區文心路一段289號',
    latitude: 24.1458,
    longitude: 120.6442,
    type: 'park',
    capacity: 8000,
    suitableHazards: ['earthquake'],
    phone: '04-2228-9111'
  },
  {
    id: 'loc_tc_3',
    name: '臺中捷運文心森林公園站地下層（防空避難）',
    county: '臺中市',
    district: '南屯區',
    address: '臺中市南屯區文心路一段280號B1',
    latitude: 24.1456,
    longitude: 120.6438,
    type: 'air_raid',
    capacity: 2000,
    suitableHazards: ['air_raid', 'military_crisis'],
    phone: '04-3706-0100'
  },

  // 高雄市
  {
    id: 'loc_kh_1',
    name: '高雄市立高雄高級中學避難收容處所',
    county: '高雄市',
    district: '三民區',
    address: '高雄市三民區建國三路50號',
    latitude: 22.6375,
    longitude: 120.3006,
    type: 'shelter',
    capacity: 2800,
    suitableHazards: ['earthquake', 'typhoon_flood'],
    phone: '07-286-2550'
  },
  {
    id: 'loc_kh_2',
    name: '高雄中央公園防空地下街避難處所',
    county: '高雄市',
    district: '前金區',
    address: '高雄市前金區中山二路與五福三路口地下層',
    latitude: 22.6247,
    longitude: 120.3012,
    type: 'air_raid',
    capacity: 5000,
    suitableHazards: ['air_raid', 'military_crisis'],
    phone: '07-336-8333'
  },

  // 新竹市
  {
    id: 'loc_hc_1',
    name: '國立新竹高級中學避難收容處所',
    county: '新竹市',
    district: '東區',
    address: '新竹市東區學府路36號',
    latitude: 24.7946,
    longitude: 120.9855,
    type: 'shelter',
    capacity: 2000,
    suitableHazards: ['earthquake', 'typhoon_flood'],
    phone: '03-571-2171'
  },

  // 台南市
  {
    id: 'loc_tn_1',
    name: '國立臺南第一高級中學避難處所',
    county: '臺南市',
    district: '東區',
    address: '臺南市東區民族路一段1號',
    latitude: 22.9942,
    longitude: 120.2168,
    type: 'shelter',
    capacity: 2500,
    suitableHazards: ['earthquake', 'typhoon_flood'],
    phone: '06-237-1206'
  }
];
