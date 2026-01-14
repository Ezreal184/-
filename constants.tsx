
import { Post, UserProfile } from './types';

export const MOCK_USER: UserProfile = {
  name: "亚历克斯 · 斯特林",
  title: "专业阿尔卑斯登山家",
  bio: "高山攀登者 & 摄影师 | 巅峰收集者 | 追逐下一个顶峰",
  stats: {
    climbs: 128,
    followers: "2.4k",
    following: 850
  },
  avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC8-kXoXZ49wx_QN3-9zWISllnAfGrJ6rzUpEyMgf-ml-9RvkiahYLgz9-yGA_BRSfI-8dEbyWMfqPFEtmfaGbqgs7Vn63giSmt2nbO9vpPjqaiQBbE-V10zqYVGV84yoYm47AhUV5zVPkpAAv_VSKFIXf9ImPMkrtAciKsp1jzj8r-4a9aXMrOiSxxCKd3QZYK5lpSqo9v5kApkT7TDMYxQRHDvmrIBW7BxN8YvwnnC3QCV6pm7bWaQVIC9lAabsbVoAS6fE604r8",
  bannerUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCBuGaEDc95CKZHu90GtlLtAdtt1A_WNBYVF-QiZ21_8YHYzTzd8oLJRT2AO5wSO_YOLHPJGAfaF3-dg0uHOvYfnarJKmaiub8V_vPnm8pJnR3xCGx2c_Jj3HqD5AHS999BpYMIupO23rlKZcm9NXuGQMDgNMTuOM8_NVcaALSGi9jdb8yCBsJjHI4L4xQuJJPdwgo7qQGxt9islZ4KR0-YfFIpEZypxSIjLzu4CHKnplpoZvU9hvEJ0zT0cRL8apFo2I62BODOZXg"
};

export const MOCK_POSTS: Post[] = [
  {
    id: "1",
    title: "安纳普尔纳大本营",
    location: "尼泊尔",
    date: "2023-05-12",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCS2p-UoOAxrQcn7cgMTxChNyr6WKSkuyhmJvl6tui2Ko3IKcMbSsjOdckKn83JCfk1xL87Z5hx-FMS8c31Uj9KpLtjd-jG5HByelwuvXWj_qqwXdBMAP3Zu7pBb8camxbGAbAw39rHNDoKjI_aRyfUU3EgHA4PItsM3gD37JDJZoamymVh91nwSLLHHkjopwwKEWiMIYoHZ0aHl_-eEG52c1yWcz3H-sLbhY3AGQDvRSqdQoTe1uCiIEOLEyRwY4neyJHuP-spaA0",
    altText: "蓝天下的雄伟山峰"
  },
  {
    id: "2",
    title: "垂直极限",
    location: "法国阿尔卑斯山",
    date: "2023-12-24",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAebXEsfq5lQmumT-nXyzvQ2P_vy1cRIekKlHSScqmr8C28hZjL3b5KzKukZVS0_pnYPTX9uEVoTzDywPdsGeVKqeJk3pvprvVwrhY41uvxZfyezF7y1X9ckOa1aJtYMPgKO4bS52OdigI88f4SE9XiFXHw9TwCHLZCDfuk0WtjjgYMD9Hiy5gzxbkxAqfW1L0x5e0yDIQNNlpSAnk5i5Od67eusK507Vy9GQOjtEymC0BIO1GzbzhaYWH9bbIHh2hUd3brTTYcfkA",
    altText: "在陡峭雪脊上的登山者"
  },
  {
    id: "3",
    title: "巴塔哥尼亚测绘",
    location: "巴塔哥尼亚",
    date: "2024-03-15",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHhNwyqXDaLRn48VS8JdSB-CLEDfev0JkojxwCQHKB5YGCBdpLCd_OkhuPyv5PYUY_ao2gK1c7_sSWRmK03qAEzJYvB5b5sHuEUeiDex8-janKJEsO4DBQ5wk567GAd2Zl1DXrmfsnGSUfOb4Fuw_a0ErTIdLZAJdkPEEc63-qTgPqZ95AK9rMUKtazrCz5ooKxrXBN0Goo8vUqbg7WbwRiBigCrIUTH096zTFG3UK_wMDloIkpTbFtfOn4NuEs8IfapQBZbgIC5A",
    altText: "风景优美的地形轨迹地图可视化"
  },
  {
    id: "4",
    title: "珠穆朗玛之巅",
    location: "喜马拉雅山脉",
    date: "2024-05-20",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQsqGDzFv-L75yfKSHnNEqTjvOsaW8I3sh--msaEiUdQNYlDcSeK053MZ6ssxPIfDj732gwGdccMM4bmDho3KQueerBBb5nTlEFwXbdCNoXEN8R-1bcZY7r11kFKphvK2MbS9YwvuuyWM1u6mS8k9qPnIIyNl444QxHo83UV0LFthI0ydTiphySWvp4UffcPa-h_DGXwNIhz5WERdOFxh4QOKJZuM-HIU63SobhFMqtD7PIJAy_BjzinrrMGEAUZFpzEvIe05_VoM",
    altText: "登山设备和绳索的近距离拍摄"
  },
  {
    id: "5",
    title: "璀璨星空夜",
    location: "雷尼尔山",
    date: "2024-07-02",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCcqTkap_UQuEMjhKLD9P1BVBztTMQfQ-cBFL86ga9Ipfi7hdv6KGt1m9WgbJJVMgPPL-qFQMD_VEyJR643x5F2uIvYaswMgq5IygR3fom7eConl0h-CHg7Rk6IK1CSu6jbDuWeri2DGEb1iHdG8fS9fO2RkrAf7fxgV9dYgXQY1uoGIp6pkyrLKSSW-TmGSqfFrbAIf9S2lLu1qtrxMxg2SJWNQlR5TlayvM02hzoxkksVAvuz-ag9qrEBYx4RPyz-bdM6VFBuRdY",
    altText: "山峰上空惊艳的银河"
  },
  {
    id: "6",
    title: "晨曦山谷",
    location: "约塞米蒂",
    date: "2024-08-11",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCuEE2QYetgwU0UuGM10JoJGPDmcCobC0x1ly36fZN4Qc-UEHADHjp8yuHBcRNxoOpkg2HFd2liSxTzKunpBEOLKlNzqF3OLeGE3clHcZOBaSJ3VIVDR9EBQhaGqdMBJ5M2xmfpPU6wEz41f__bq8Ka5HFM8iw-LHicdP2n5TCXSP9VwlUzwWk-0-_CNdNlIITE4XjyruR1jiR9CtNd5VUYbaJ2oHGmz3dSgnZzmwCqs0OcUqGLZb-6KvJZKq85lwUw_gF7oqYfwFs",
    altText: "松树和山脉的山谷视图"
  }
];
